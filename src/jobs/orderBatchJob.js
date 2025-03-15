const cron = require('cron')
const { batchAndAssignOrders } = require('../services/orderBatchService')
const { logger } = require('../utils/logger')
const nconf = require('nconf')
const orderBatchInterval = nconf.get('ORDER_BATCH_INTERVAL')

const CronJob = cron.CronJob

// Create a cron job using the interval specified in config (e.g., every minute)
const job = new CronJob(orderBatchInterval, async () => {
  logger.info('Order batching job started.')
  try {
    await batchAndAssignOrders()
  } catch (error) {
    logger.error('Error in order batching job', error)
  }
})

module.exports = {
  start: () => job.start()
}
