// utils/fetchMetadata.js

import axios from 'axios'

export async function fetchMetadata(url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching URL:', error)
    throw error
  }
}
