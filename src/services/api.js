import axios from 'axios'
import { API_BASE_URL } from '../config'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Public: create booking (no auth required)
export const createPublicBooking = async (data) => {
  const res = await api.post('/bookings/public', data)
  return res.data
}

// Public: get available TVs for a date/time
export const getBookingAvailability = async ({ date, timeSlot }) => {
  const res = await api.get('/bookings/availability', { params: { date, timeSlot } })
  return res.data
}

// Public: get live TV status
export const getTVStatus = async () => {
  const res = await api.get('/tv/public-status')
  return res.data
}

// Public: get game lists for all TVs
export const getTVGameLists = async () => {
  const res = await api.get('/tv-games/public')
  return res.data
}
