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

// Public: list open / in-progress tournaments
export const getPublicTournaments = async () => {
  const res = await api.get('/tournaments/public')
  return res.data
}

// Public: self-register for a tournament
export const registerForTournament = async (tournamentId, data) => {
  const res = await api.post(`/tournaments/${tournamentId}/registrations/public`, data)
  return res.data
}

// Public: fetch fixtures / bracket / league table for a tournament
export const getPublicTournamentFixtures = async (tournamentId) => {
  const res = await api.get(`/tournaments/${tournamentId}/fixtures/public`)
  return res.data
}

// Public: past (completed / cancelled) tournaments with winners
export const getPastTournaments = async () => {
  const res = await api.get('/tournaments/public/past')
  return res.data
}
