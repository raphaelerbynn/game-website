import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [darkMode, setDarkMode]         = useState(true)
  const [bookingOpen, setBookingOpen]   = useState(false)
  const [toastMsg, setToastMsg]         = useState(null)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else          document.documentElement.classList.remove('dark')
  }, [darkMode])

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, bookingOpen, setBookingOpen, showToast, toastMsg, setToastMsg }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
