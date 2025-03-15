const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeliveryAgentSchema = new Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  phoneNumber: { type: String, required: true },
  status: { type: String, enum: ['available', 'busy'], default: 'available' }
})

module.exports = mongoose.model('DeliveryAgent', DeliveryAgentSchema)