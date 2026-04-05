import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Monitor, User, Phone, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { WA_NUMBER } from '../config'

const durations = ['1 Hour – GHS 15', '2 Hours – GHS 25', '3 Hours – GHS 35', '4 Hours – GHS 45']
const stations  = ['Any Available', 'Standard PS5', 'Premium Station', 'VIP Corner']
const timeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
]

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate">{label}</label>
    {children}
  </div>
)

const inputCls = `w-full px-4 py-3 rounded-xl bg-ivory-2 dark:bg-navy-2 border border-gold/20
  text-sm text-navy dark:text-ivory placeholder-slate/50
  focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all duration-200`

const SelectField = ({ value, onChange, options, icon: Icon }) => (
  <div className="relative">
    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`${inputCls} pl-9 pr-9 appearance-none cursor-pointer`}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
  </div>
)

function buildWhatsAppMsg(form) {
  return encodeURIComponent(
    `Hello Rahitalu Game Lounge! I'd like to book a session.\n\n` +
    `Name: ${form.name}\n` +
    `Phone: ${form.phone}\n` +
    `Date: ${form.date}\n` +
    `Time: ${form.time}\n` +
    `Duration: ${form.duration}\n` +
    `Station: ${form.station}\n\n` +
    `Please confirm my booking. Thank you!`
  )
}

export default function BookingModal() {
  const { bookingOpen, setBookingOpen, showToast } = useApp()
  const [form, setForm] = useState({
    name: '', phone: '',
    date: '', time: timeSlots[0],
    duration: durations[1], station: stations[0],
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.date) {
      showToast('Please fill in your name, phone, and date.', 'error')
      return
    }
    const url = `https://wa.me/${WA_NUMBER}?text=${buildWhatsAppMsg(form)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setBookingOpen(false)
    showToast(`Opening WhatsApp to confirm your booking, ${form.name}!`, 'success')
    setForm({ name: '', phone: '', date: '', time: timeSlots[0], duration: durations[1], station: stations[0] })
  }

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setBookingOpen(false)}>

          <div className="absolute inset-0 bg-navy/70 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-ivory dark:bg-navy-2 rounded-3xl shadow-gold-lg
                       border border-gold/20 overflow-hidden">

            <div className="h-1 w-full bg-gold-gradient" />

            <div className="px-7 pt-6 pb-5 border-b border-gold/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-1">Reserve Your Spot</p>
                  <h2 className="font-display text-2xl font-bold text-navy dark:text-ivory">Book a Session</h2>
                </div>
                <button onClick={() => setBookingOpen(false)}
                  className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center
                             text-slate hover:text-navy dark:hover:text-ivory hover:bg-gold/10 transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Your Name *">
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="e.g. Kwame" className={`${inputCls} pl-9`} />
                  </div>
                </Field>

                <Field label="Phone / WhatsApp *">
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+233 ..." className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date *">
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`${inputCls} pl-9`} />
                  </div>
                </Field>

                <Field label="Start Time">
                  <SelectField value={form.time} onChange={v => set('time', v)}
                    options={timeSlots} icon={Clock} />
                </Field>
              </div>

              <Field label="Session Duration">
                <SelectField value={form.duration} onChange={v => set('duration', v)}
                  options={durations} icon={Clock} />
              </Field>

              <Field label="Station Preference">
                <SelectField value={form.station} onChange={v => set('station', v)}
                  options={stations} icon={Monitor} />
              </Field>

              {/* Info box */}
              <div className="bg-gold-pale dark:bg-gold/10 rounded-xl px-4 py-3 border border-gold/20
                              flex items-start gap-2.5">
                <span className="text-lg leading-none">💬</span>
                <p className="text-[11px] text-navy dark:text-ivory/80 leading-relaxed">
                  Tapping <strong className="text-gold">Confirm</strong> will open WhatsApp with your details
                  pre-filled. Just hit send and we'll confirm your slot.
                </p>
              </div>

              <motion.button type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold w-full py-3.5 text-sm mt-1">
                Confirm via WhatsApp
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
