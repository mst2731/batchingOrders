const DeliveryAgent = require('../models/deliveryAgent')


async function createDeliveryAgent(req, res) {
  try {
    const agentData = req.body
    const newAgent = await DeliveryAgent.create(agentData)
    res.status(201).json(newAgent)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

async function getAvailableAgents() {
  try {
    const agents = await DeliveryAgent.find({ status: 'available' })
    return agents
  }
  catch (error) {
    throw new Error(error.message)
  }
}

async function assignOrderToAgent(agentId, orderId) {
  return DeliveryAgent.findByIdAndUpdate(agentId, { $push: { assignedOrders: orderId }, status: 'busy' }, { new: true })
}

async function markAgentAvailable(agentId) {
  return DeliveryAgent.findByIdAndUpdate(agentId, { status: 'available', $set: { assignedOrders: [] } }, { new: true })
}

// Used for testing purposes to create multiple agents at once
async function createBulkAgents(req, res) {
  try {
    const agentsData = req.body
    const newAgents = await DeliveryAgent.insertMany(agentsData)
    res.status(201).json(newAgents)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { createDeliveryAgent, getAvailableAgents, assignOrderToAgent, markAgentAvailable, createBulkAgents }