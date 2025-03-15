const Order = require('../models/Order')

async function createOrder(req, res) {
  try {
    const orderData = req.body
    const newOrder = await Order.create(orderData)
    res.status(201).json(newOrder)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

async function updateOrder(orderId, updateData) {
  try {
    const updateOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
    return updateOrder
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getPendingOrders() {
  try {
    const orders = await Order.find({ status: 'pending' })
    return orders
  } catch (error) {
    throw new Error(error.message)
  }
}

// Used for testing purposes to create multiple orders at once
async function createBulkOrders(req, res) {
  try {
    const ordersData = req.body
    const newOrders = await Order.insertMany(ordersData)
    res.status(201).json(newOrders)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { createOrder, updateOrder, getPendingOrders, createBulkOrders }