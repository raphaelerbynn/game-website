import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Bell, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { WA_NUMBER } from '../config'

const gameOptions = [
  { value: 'fc26',      label: 'EA Sports FC 26 — Football' },
  { value: 'mk',        label: 'Mortal Kombat — Fighting' },
  { value: 'both',      label: 'Both Tournaments' },
]

const inputCls = `w-full px-4 py-3 rounded-xl bg-navy-2/60 border border-gold/20
  text-sm text-ivory placeholder-slate-2/50
  focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all duration-200`

export default function TournamentRegModal({ open, onClose, defaultGame }) {
  const { showToast } = useApp()
  const [form, setForm] = useState({ name: '', phone: '', game: 'fc26', note: '' })
  const [submitted, setSubmitted] = useState(false)

  // Sync defaultGame from parent
  useEffect(() => {
    if (defaultGame) {
      setForm(f => ({ ...f, game: defaultGame }))
    }
  }, [defaultGame, open])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSubmitted(false)
        setForm({ name: '', phone: '', game: 'fc26', note: '' })
      }, 400)
    }
  }, [open])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      showToast('Please enter your name and phone number.', 'error')
      return
    }
    const gameLabel = gameOptions.find(g => g.value === form.game)?.label ?? form.game
    const text = encodeURIComponent(
      `Hi Rahitalu Game Lounge! 🏆\n\n` +
      `I'd like to pre-register for the upcoming tournament.\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Tournament: ${gameLabel}\n` +
      (form.note ? `Note: ${form.note}\n` : '')
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-navy/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">

            <div className="pointer-events-auto w-full max-w-md relative rounded-3xl overflow-hidden
                            shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-gold/20"
              style={{ background: '#0A1628' }}>

              {/* Top gold accent */}
              <div className="h-1 w-full bg-gold-gradient" />

              {/* Coming Soon overlay ribbon */}
              <div className="bg-gold/10 border-b border-gold/20 px-6 py-2.5 flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold">
                  Registration Coming Soon — Pre-Register Now
                </span>
              </div>

              <div className="p-7">

                {/* Close button */}
                <button onClick={onClose}
                  className="absolute top-10 right-5 w-8 h-8 rounded-xl flex items-center justify-center
                             text-slate-2 hover:text-ivory hover:bg-white/5 transition-all duration-200">
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/20
                                  flex items-center justify-center flex-shrink-0">
                    <Trophy size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ivory leading-tight">
                      Tournament Pre-Registration
                    </h3>
                    <p className="text-xs text-slate-2 mt-0.5">
                      Get notified when registration opens
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* Success state */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20
                                      flex items-center justify-center mx-auto mb-5">
                        <CheckCircle size={30} className="text-gold" strokeWidth={1.5} />
                      </div>
                      <h4 className="font-display text-xl font-bold text-ivory mb-2">You're on the list!</h4>
                      <p className="text-sm text-slate-2 mb-6 leading-relaxed">
                        Your WhatsApp message is ready. Send it to complete your pre-registration
                        and we'll notify you the moment registration officially opens.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onClose}
                        className="btn-gold text-sm px-8 py-3">
                        Done
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* Form state */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4">

                      <div>
                        <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="e.g. Kwame Asante"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          placeholder="+233 ..."
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                          Tournament
                        </label>
                        <select
                          value={form.game}
                          onChange={e => set('game', e.target.value)}
                          className={inputCls + ' cursor-pointer'}>
                          {gameOptions.map(g => (
                            <option key={g.value} value={g.value}
                              style={{ backgroundColor: '#0A1628', color: '#F0F4FF' }}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                          Anything to add? <span className="font-normal opacity-50">(optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={form.note}
                          onChange={e => set('note', e.target.value)}
                          placeholder="e.g. I want to bring a friend, any questions..."
                          className={inputCls + ' resize-none'}
                        />
                      </div>

                      {/* Info note */}
                      <div className="rounded-xl bg-gold/5 border border-gold/15 px-4 py-3 flex gap-2.5">
                        <Bell size={14} className="text-gold flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-2 leading-relaxed">
                          This will open WhatsApp with your details pre-filled. Send the message
                          and you'll be added to our tournament notification list.
                        </p>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-gold w-full text-sm py-3 mt-1 flex items-center justify-center gap-2">
                        <Bell size={14} />
                        Pre-Register via WhatsApp
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
