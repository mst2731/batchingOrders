// src/services/googleMapsService.js
const axios = require('axios')
const { logger } = require('../utils/logger')
const nconf = require('nconf')

const googleMapsApiKey = nconf.get('GOOGLE_MAPS_API_KEY')

exports.getDistanceMatrix = async (origins, destinations) => {
  try {
    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key is missing in configuration.')
    }

    const payload = {
      origins: origins.map(o => ({
        waypoint: {
          location: {
            latLng: {
              latitude: o.lat,
              longitude: o.lng,
            },
          },
        },
        routeModifiers: { avoid_ferries: true },
      })),
      destinations: destinations.map(d => ({
        waypoint: {
          location: {
            latLng: {
              latitude: d.lat,
              longitude: d.lng,
            },
          },
        },
      })),
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix',
      headers: {
        'X-Goog-Api-Key': googleMapsApiKey,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
        'Content-Type': 'application/json'
      },
      data: payload
    }

    const response = await axios.request(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error('Error fetching distance matrix from Google Maps API', {
        message: error.message,
        response: error.response ? error.response.data : undefined,
        status: error.response ? error.response.status : undefined,
      })
    } else {
      logger.error('Error fetching distance matrix from Google Maps API', {
        message: error.message
      })
    }
    throw error
  }
}