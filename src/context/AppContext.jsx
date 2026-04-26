import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { getPublicTournaments } from '../services/api'

const AppContext = createContext()

const DISMISSED_KEY = 'rgl_dismissed_tournament_banners'

const readDismissed = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeDismissed = (ids) => {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids))
  } catch {
    // localStorage unavailable — silently give up
  }
}

export function AppProvider({ children }) {
  const [darkMode, setDarkMode]         = useState(true)
  const [bookingOpen, setBookingOpen]   = useState(false)
  const [toastMsg, setToastMsg]         = useState(null)

  const [tournaments, setTournaments]       = useState([])
  const [tournamentsLoading, setTournamentsLoading] = useState(true)
  const [dismissedIds, setDismissedIds]     = useState(() => readDismissed())
  const [registrationModal, setRegistrationModal] = useState({ open: false, tournament: null })

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else          document.documentElement.classList.remove('dark')
  }, [darkMode])

  const refreshTournaments = useCallback(() => {
    return getPublicTournaments()
      .then((res) => setTournaments(Array.isArray(res?.data) ? res.data : []))
      .catch(() => { /* leave previous list in place */ })
  }, [])

  useEffect(() => {
    let active = true
    getPublicTournaments()
      .then((res) => {
        if (!active) return
        setTournaments(Array.isArray(res?.data) ? res.data : [])
      })
      .catch(() => {
        if (active) setTournaments([])
      })
      .finally(() => {
        if (active) setTournamentsLoading(false)
      })
    return () => { active = false }
  }, [])

  const dismissTournamentBanner = useCallback((id) => {
    setDismissedIds((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      writeDismissed(next)
      return next
    })
  }, [])

  const openTournamentRegistration = useCallback((tournament) => {
    if (tournament) setRegistrationModal({ open: true, tournament })
  }, [])

  const closeTournamentRegistration = useCallback(() => {
    setRegistrationModal((prev) => ({ ...prev, open: false }))
  }, [])

  // Banner shows soonest non-dismissed open/in-progress tournament
  const bannerTournament = useMemo(() => {
    const eligible = tournaments.filter(
      (t) => !dismissedIds.includes(t._id) && !t.isFull
    )
    // API already sorts by scheduledAt asc; first is soonest
    return eligible[0] || null
  }, [tournaments, dismissedIds])

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  return (
    <AppContext.Provider
      value={{
        darkMode, setDarkMode,
        bookingOpen, setBookingOpen,
        showToast, toastMsg, setToastMsg,
        tournaments, tournamentsLoading, refreshTournaments,
        bannerTournament, dismissTournamentBanner,
        registrationModal, openTournamentRegistration, closeTournamentRegistration,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
