import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Monitor, User, Phone, Gamepad2, ChevronDown, Copy, Check, Users, Wifi } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { createPublicBooking, getBookingAvailability } from '../services/api'

const TV_COUNT = 5

const GAME_TYPES = [
  { value: 'adventure', label: 'Adventure', mode: 'time', maxPlayers: 1 },
  { value: 'arcade', label: 'Arcade', mode: 'per-game', maxPlayers: 2 },
  { value: 'fc26', label: 'FC 26', mode: 'per-game', maxPlayers: 2 },
  { value: 'fc25', label: 'FC 25', mode: 'per-game', maxPlayers: 2 },
  { value: 'mk', label: 'Mortal Kombat', mode: 'per-game', maxPlayers: 2 },
]

const DURATIONS = [
  { mins: 30, price: 10, label: '30 Min' },
  { mins: 60, price: 20, label: '1 Hour' },
  { mins: 120, price: 40, label: '2 Hours' },
  { mins: 180, price: 60, label: '3 Hours' },
]

const PER_GAME_PRICES = {
  fc25:   { 1: 5, 2: 8 },
  fc26:   { 1: 5, 2: 8 },
  arcade: { 1: 4, 2: 6 },
  mk:     { 1: 4, 2: 6 },
}
const getPerGamePrice = (gameType, players) => PER_GAME_PRICES[gameType]?.[players] ?? 0

const timeSlots = []
for (let h = 8; h <= 22; h++) {
  for (let m = 0; m < 60; m += 30) {
    if (h === 22 && m > 0) break
    const hour = h > 12 ? h - 12 : h
    const ampm = h >= 12 ? 'PM' : 'AM'
    const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const display = `${hour}:${String(m).padStart(2, '0')} ${ampm}`
    timeSlots.push({ value: val, display })
  }
}

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate">{label}</label>
    {children}
  </div>
)

const inputCls = `w-full px-4 py-3 rounded-xl bg-ivory-2 dark:bg-navy-2 border border-gold/20
  text-sm text-navy dark:text-ivory placeholder-slate/50
  focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all duration-200`

export default function BookingModal() {
  const { bookingOpen, setBookingOpen, showToast } = useApp()
  const [form, setForm] = useState({
    customerName: '', customerPhone: '',
    date: '', timeSlot: '',
    tvNumber: '', gameType: '', duration: 30, players: 2,
  })
  const [availableTVs, setAvailableTVs] = useState([])
  const [loadingTVs, setLoadingTVs] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isTimeBased = form.gameType && GAME_TYPES.find(g => g.value === form.gameType)?.mode === 'time'
  const isPerGame = form.gameType && GAME_TYPES.find(g => g.value === form.gameType)?.mode === 'per-game'
  const selectedGame = GAME_TYPES.find(g => g.value === form.gameType)
  const maxPlayers = selectedGame?.maxPlayers || 2

  // Reset form when modal opens
  useEffect(() => {
    if (bookingOpen) {
      setForm({
        customerName: '', customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '', tvNumber: '', gameType: '', duration: 30, players: 2,
      })
      setResult(null)
      setError('')
      setAvailableTVs([])
    }
  }, [bookingOpen])

  // Fetch available TVs when date + timeSlot change
  useEffect(() => {
    if (!form.date || !form.timeSlot) return
    setLoadingTVs(true)
    setAvailableTVs([])
    set('tvNumber', '')
    getBookingAvailability({ date: form.date, timeSlot: form.timeSlot })
      .then(data => setAvailableTVs(data.data?.availableTVs || []))
      .catch(() => setAvailableTVs([]))
      .finally(() => setLoadingTVs(false))
  }, [form.date, form.timeSlot])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.gameType || !form.tvNumber || !form.timeSlot) {
      setError('Please fill in all required fields')
      return
    }

    const payload = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      date: form.date,
      timeSlot: form.timeSlot,
      tvNumber: Number(form.tvNumber),
      gameType: form.gameType,
      players: form.players,
    }
    if (isTimeBased) payload.duration = Number(form.duration)

    setSubmitting(true)
    try {
      const data = await createPublicBooking(payload)
      setResult(data.data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const copyCode = () => {
    if (result?.bookingCode) {
      navigator.clipboard.writeText(result.bookingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const priceText = isPerGame
    ? `GH₵${getPerGamePrice(form.gameType, form.players)}/game`
    : isTimeBased
      ? `GH₵${DURATIONS.find(d => d.mins === form.duration)?.price || 10}`
      : ''

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => !submitting && setBookingOpen(false)}>

          <div className="absolute inset-0 bg-navy/70 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-ivory dark:bg-navy-2 rounded-3xl shadow-gold-lg
                       border border-gold/20 overflow-hidden max-h-[92vh] overflow-y-auto">

            <div className="h-1 w-full bg-gold-gradient" />

            {/* Header */}
            <div className="px-7 pt-6 pb-5 border-b border-gold/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-1">
                    {result ? 'Booking Confirmed' : 'Reserve Your Spot'}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-navy dark:text-ivory">
                    {result ? 'You\'re Booked!' : 'Book a Session'}
                  </h2>
                </div>
                <button onClick={() => setBookingOpen(false)}
                  className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center
                             text-slate hover:text-navy dark:hover:text-ivory hover:bg-gold/10 transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* SUCCESS VIEW */}
            {result ? (
              <div className="px-7 py-6">
                {/* QR Code */}
                {result.qrCodeData && (
                  <div className="flex justify-center mb-5">
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <img src={result.qrCodeData} alt="Booking QR" className="w-44 h-44" />
                    </div>
                  </div>
                )}

                {/* Booking Code */}
                <div className="text-center mb-5">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate mb-1.5">
                    Your Booking Code
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-display text-4xl font-bold tracking-[0.3em] text-navy dark:text-ivory">
                      {result.bookingCode}
                    </span>
                    <button onClick={copyCode}
                      className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center
                                 text-gold hover:bg-gold/10 transition-all">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-ivory-2 dark:bg-navy rounded-xl divide-y divide-gold/10 border border-gold/10 mb-5">
                  {[
                    ['Game', GAME_TYPES.find(g => g.value === result.gameType)?.label || result.gameType],
                    ['Players', `${result.players || 2} Player${(result.players || 2) > 1 ? 's' : ''}`],
                    ['Date', new Date(result.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
                    ['Time', result.timeSlot],
                    ['TV', `Station ${result.tvNumber}`],
                    ...(result.duration ? [['Duration', `${result.duration} min`]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-3">
                      <span className="text-xs text-slate">{label}</span>
                      <span className="text-xs font-semibold text-navy dark:text-ivory">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Free WiFi */}
                <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3 border border-emerald-200 dark:border-emerald-800/40 mb-3">
                  <Wifi size={16} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    <strong>Free WiFi</strong> available — you'll get the password when you check in.
                  </p>
                </div>

                {/* Info */}
                <div className="bg-gold-pale dark:bg-gold/10 rounded-xl px-4 py-3 border border-gold/20 mb-5">
                  <p className="text-[11px] text-navy dark:text-ivory/80 leading-relaxed text-center">
                    Save a screenshot of this page. Present the <strong className="text-gold">code or QR</strong> when you arrive.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setResult(null); setError('') }}
                  className="btn-gold w-full py-3.5 text-sm">
                  Book Another Session
                </motion.button>
              </div>
            ) : (
              /* BOOKING FORM */
              <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Your Name">
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input type="text" value={form.customerName} onChange={e => set('customerName', e.target.value)}
                        placeholder="e.g. Kwame" className={`${inputCls} pl-9`} />
                    </div>
                  </Field>
                  <Field label="Phone">
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input type="tel" value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)}
                        placeholder="024..." className={`${inputCls} pl-9`} />
                    </div>
                  </Field>
                </div>

                {/* Game Type */}
                <Field label="Game Type *">
                  <div className="grid grid-cols-2 gap-2">
                    {GAME_TYPES.map(g => (
                      <button key={g.value} type="button"
                        onClick={() => {
                          set('gameType', g.value)
                          if (g.maxPlayers === 1) set('players', 1)
                          else if (form.gameType && GAME_TYPES.find(t => t.value === form.gameType)?.maxPlayers === 1) set('players', 2)
                        }}
                        className={`py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                          form.gameType === g.value
                            ? 'border-gold bg-gold/10 text-navy dark:text-ivory'
                            : 'border-gold/20 bg-ivory-2 dark:bg-navy text-slate hover:border-gold/40'
                        }`}>
                        <span className="block font-bold text-xs">{g.label}</span>
                        <span className="text-[10px] text-slate">
                          {g.mode === 'time' ? (g.maxPlayers === 1 ? 'Solo · Time-based' : 'Time-based') : `From GH₵${getPerGamePrice(g.value, 1)}/game`}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Players — only show for games that support 2 players */}
                {form.gameType && maxPlayers > 1 && (
                  <Field label="Players *">
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map(n => (
                        <button key={n} type="button"
                          onClick={() => set('players', n)}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                            form.players === n
                              ? 'border-gold bg-gold/10 text-navy dark:text-ivory'
                              : 'border-gold/20 bg-ivory-2 dark:bg-navy text-slate hover:border-gold/40'
                          }`}>
                          <div className="flex items-center justify-center gap-1.5">
                            <Users size={14} className="text-gold" />
                            <span className="font-bold text-xs">{n} Player{n > 1 ? 's' : ''}</span>
                          </div>
                          {isPerGame && (
                            <span className="text-[10px] text-slate">GH₵{getPerGamePrice(form.gameType, n)}/game</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date *">
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`${inputCls} pl-9`} required />
                    </div>
                  </Field>
                  <Field label="Time *">
                    <div className="relative">
                      <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <select value={form.timeSlot}
                        onChange={e => set('timeSlot', e.target.value)}
                        className={`${inputCls} pl-9 pr-9 appearance-none cursor-pointer`} required>
                        <option value="">Select</option>
                        {timeSlots.map(t => (
                          <option key={t.value} value={t.value}>{t.display}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
                    </div>
                  </Field>
                </div>

                {/* TV Selection */}
                <Field label="Station *">
                  {form.date && form.timeSlot ? (
                    loadingTVs ? (
                      <div className="flex items-center gap-2 py-3">
                        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-slate">Checking availability...</span>
                      </div>
                    ) : availableTVs.length > 0 ? (
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: TV_COUNT }, (_, i) => i + 1).map(n => {
                          const avail = availableTVs.includes(n)
                          return (
                            <button key={n} type="button" disabled={!avail}
                              onClick={() => set('tvNumber', String(n))}
                              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                                form.tvNumber === String(n)
                                  ? 'border-gold bg-gold/10 text-navy dark:text-ivory'
                                  : avail
                                    ? 'border-gold/20 bg-ivory-2 dark:bg-navy text-slate hover:border-gold/40'
                                    : 'border-gold/10 bg-ivory-2/50 dark:bg-navy/50 text-slate/30 cursor-not-allowed'
                              }`}>
                              {n}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-red-400 py-2">No stations available for this time</p>
                    )
                  ) : (
                    <p className="text-xs text-slate py-2">Select date & time first</p>
                  )}
                </Field>

                {/* Duration — time-based games only */}
                {isTimeBased && (
                  <Field label="Duration *">
                    <div className="grid grid-cols-2 gap-2">
                      {DURATIONS.map(d => (
                        <button key={d.mins} type="button"
                          onClick={() => set('duration', d.mins)}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                            form.duration === d.mins
                              ? 'border-gold bg-gold/10 text-navy dark:text-ivory'
                              : 'border-gold/20 bg-ivory-2 dark:bg-navy text-slate hover:border-gold/40'
                          }`}>
                          <span className="block font-bold text-xs">{d.label}</span>
                          <span className="text-[10px] text-slate">GH₵{d.price}</span>
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-400 text-center px-2">{error}</p>
                )}

                {/* Submit */}
                <motion.button type="submit" disabled={submitting || !form.gameType || !form.tvNumber || !form.timeSlot}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="btn-gold w-full py-3.5 text-sm mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Booking...' : `Book Now${priceText ? ` — ${priceText}` : ''}`}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
