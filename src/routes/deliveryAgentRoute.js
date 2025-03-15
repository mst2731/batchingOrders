const express = require('express')
const router = express.Router()
const deliveryController = require('../controllers/deliveryController')

router.post('/', deliveryController.createDeliveryAgent)
router.post('/createBulkAgents', deliveryController.createBulkAgents)

module.exports = router