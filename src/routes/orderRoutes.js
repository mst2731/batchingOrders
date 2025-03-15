const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.createOrder)
router.post('/createBulkOrders', orderController.createBulkOrders)

module.exports = router