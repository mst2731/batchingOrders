// server.js
const express = require('express')
const app = express()
const nconf = require('nconf')
const env = process.env.NODE_ENV || 'dev'
const path = require('path')
if (env === 'dev') {
  const fileName = env + '.json'
  nconf.file(path.join(__dirname, '/env/' + fileName))
  nconf.set('NODE_ENV', env)
}

const { logger } = require('./src/utils/logger')
const orderRoutes = require('./src/routes/orderRoutes')
const deliveryRoutes = require('./src/routes/deliveryAgentRoute')
const db = require('./src/config/db')
const orderBatchJob = require('./src/jobs/orderBatchJob')

const PORT = nconf.get('PORT') || 3000



// Middleware to parse JSON requests
app.use(express.json())

// Routes for order endpoints
app.use('/api/orders', orderRoutes)

// Routes for delivery agent endpoints
app.use('/api/delivery-agents', deliveryRoutes)

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Connect to the database and start the server
db.connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      // Start the cron job once the server is up
      orderBatchJob.start()
    })
  })
  .catch(err => {
    logger.error('Failed to connect to database', err)
  })
