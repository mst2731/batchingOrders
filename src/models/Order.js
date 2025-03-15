const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  customerId: { type: String, required: true }, // This is dummy for now, for end-to-end application, this should be a reference to the Customer model
  restaurantId: { type: String, required: true },
  deliveryLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  orderTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'assigned', 'delivered'], default: 'pending' },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAgentId: { type: Schema.Types.ObjectId, ref: 'DeliveryAgent' }
})

module.exports = mongoose.model('Order', OrderSchema);
