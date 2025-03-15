const { getDistanceMatrix } = require('./googleMapService')
const { logger } = require('../utils/logger')
const { getPendingOrders, updateOrder } = require('../controllers/orderController')
const { getAvailableAgents, assignOrderToAgent } = require('../controllers/deliveryController')
const clustering = require('density-clustering')

async function batchAndAssignOrders() {
  const pendingOrders = await getPendingOrders()
  const availableDeliveries = await getAvailableAgents()

  if (pendingOrders.length === 0 || availableDeliveries.length === 0) {
    logger.info('No pending orders or available deliveries')
    return
  }

  const orderLocations = pendingOrders.map(order => [
    order.deliveryLocation.latitude,
    order.deliveryLocation.longitude,
    order.pickupLocation.latitude,
    order.pickupLocation.longitude,
  ])

  const epsilonValues = [0.01, 0.03, 0.06]
  const dbscan = new clustering.DBSCAN()

  for (const epsilon of epsilonValues) {
    clusters = dbscan.run(orderLocations, epsilon, 2)
    if (clusters.length > 0) {
      break
    }
  }

  const batchedOrders = {}
  if (clusters.length > 0) {
    clusters.forEach((cluster, clusterIndex) => {
      batchedOrders[clusterIndex] = cluster.map(index => pendingOrders[index])
    })
  } else {
    logger.info('No clusters found with the given epsilon values, assigning orders individually')
    pendingOrders.forEach((order, index) => {
      batchedOrders[index] = [order]
    })
  }

  for (const clusterIndex in batchedOrders) {
    const batch = batchedOrders[clusterIndex]
    if (batch.length > 0) {
      // Delivery Agent Assignment (considering current location)
      let bestDelivery = null
      let minTravelTime = Infinity

      for (const delivery of availableDeliveries) {
        const restaurant = batch[0].pickupLocation
        const distanceMatrix = await getDistanceMatrix(
          [{ lat: delivery.location.lat, lng: delivery.location.lng }],
          [{ lat: restaurant.latitude, lng: restaurant.longitude }]
        )

        if (!distanceMatrix || !distanceMatrix[0] || !distanceMatrix[0].condition || !distanceMatrix[0].duration) {
          logger.error('Error fetching distance matrix from Google Maps API', distanceMatrix)
          continue
        }

        const durationInSeconds = parseInt(distanceMatrix[0].duration.replace('s', ''), 10)
        if (distanceMatrix[0].condition === 'ROUTE_EXISTS' && durationInSeconds < minTravelTime) {
          minTravelTime = durationInSeconds
          bestDelivery = delivery
        }
      }

      if (bestDelivery) {
        availableDeliveries.splice(availableDeliveries.indexOf(bestDelivery), 1) //remove the best delivery from the available delivery array.
        for (const order of batch) {
          await updateOrder(order._id, { assignedDelivery: bestDelivery._id, status: "assigned" })
          await assignOrderToAgent(bestDelivery._id, { available: false })
        }
      }
    }
  }
  logger.info('Batched and assigned orders')
}

module.exports = { batchAndAssignOrders }