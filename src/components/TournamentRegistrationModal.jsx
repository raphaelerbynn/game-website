import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, User, Phone, CheckCircle2, Copy, Check, CreditCard, Wallet } from 'lucide-react'
import { registerForTournament } from '../services/api'
import { MOMO_NUMBER, MOMO_NAME } from '../config'
import { useApp } from '../context/AppContext'

const GAME_LABELS = {
  fc25: 'EA Sports FC 25',
  fc26: 'EA Sports FC 26',
  mk:   'Mortal Kombat',
}

const formatWhen = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(d)
}

const inputCls = `w-full px-4 py-3 rounded-xl bg-navy-2/60 border border-gold/20
  text-sm text-ivory placeholder-slate-2/50
  focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all duration-200`

export default function TournamentRegistrationModal({ open, tournament, onClose }) {
  const { showToast, refreshTournaments } = useApp()
  const [form, setForm] = useState({
    participantName: '',
    participantPhone: '',
    note: '',
    paymentMethod: 'venue', // 'venue' | 'momo'
    paymentReference: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm({
          participantName: '', participantPhone: '', note: '',
          paymentMethod: 'venue', paymentReference: '',
        })
        setResult(null)
        setError('')
      }, 300)
    }
  }, [open])

  if (!open || !tournament) return null

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const hasFee = (tournament.entryFee || 0) > 0
  const payingNow = hasFee && form.paymentMethod === 'momo'

  const copyMomo = () => {
    navigator.clipboard?.writeText(MOMO_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.participantName.trim() || !form.participantPhone.trim()) {
      setError('Please enter your name and phone number')
      return
    }
    if (payingNow && !form.paymentReference.trim()) {
      setError('Please enter your MoMo reference after paying')
      return
    }

    const payload = {
      participantName: form.participantName.trim(),
      participantPhone: form.participantPhone.trim(),
      paid: payingNow,
      paymentReference: payingNow ? form.paymentReference.trim() : '',
      note: form.note.trim(),
    }

    setSubmitting(true)
    try {
      const res = await registerForTournament(tournament._id, payload)
      setResult(res.data)
      showToast('Registered successfully!')
      refreshTournaments?.()
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => !submitting && onClose()}
        className="fixed inset-0 z-[70] bg-navy/80 backdrop-blur-sm"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-md relative rounded-3xl overflow-hidden
                     shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-gold/20 max-h-[92vh] overflow-y-auto"
          style={{ background: '#0A1628' }}
        >
          <div className="h-1 w-full bg-gold-gradient" />

          <div className="p-7">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center
                         text-slate-2 hover:text-ivory hover:bg-white/5 transition-all"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 mb-6 pr-8">
              <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-gold" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-0.5">
                  Tournament Registration
                </p>
                <h3 className="font-display text-xl font-bold text-ivory leading-tight">
                  {tournament.name}
                </h3>
                <p className="text-xs text-slate-2 mt-0.5">
                  {GAME_LABELS[tournament.gameType] || tournament.gameType} · {formatWhen(tournament.scheduledAt)}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                /* SUCCESS */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30
                                  flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={30} className="text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <h4 className="font-display text-xl font-bold text-ivory mb-2">You're in!</h4>
                  <p className="text-sm text-slate-2 mb-4 leading-relaxed">
                    {result.paid
                      ? "Your payment reference has been recorded. We'll verify and confirm via WhatsApp."
                      : "We'll see you at the venue — please bring the entry fee in cash or MoMo."}
                  </p>
                  <div className="bg-gold/5 border border-gold/15 rounded-xl px-4 py-3 mb-5 inline-block">
                    <p className="text-[11px] text-slate-2">
                      <span className="font-bold text-gold">{result.slotsLeft}</span>{' '}
                      {result.slotsLeft === 1 ? 'slot' : 'slots'} left after you
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="btn-gold text-sm px-8 py-3 w-full"
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
                /* FORM */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input
                        type="text"
                        value={form.participantName}
                        onChange={(e) => set('participantName', e.target.value)}
                        placeholder="e.g. Kwame Asante"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
                      <input
                        type="tel"
                        value={form.participantPhone}
                        onChange={(e) => set('participantPhone', e.target.value)}
                        placeholder="0241234567"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-2/60 mt-1">
                      We'll use this to confirm your spot and share updates.
                    </p>
                  </div>

                  {hasFee && (
                    <>
                      <div className="h-px bg-white/6 mt-1" />

                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <label className="text-[11px] font-semibold text-slate-2 tracking-wide">
                            Entry Fee
                          </label>
                          <span className="text-lg font-bold text-gold">
                            GH₵{tournament.entryFee}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => set('paymentMethod', 'venue')}
                            className={`py-3 px-3 rounded-xl text-xs font-medium border-2 transition-all ${
                              form.paymentMethod === 'venue'
                                ? 'border-gold bg-gold/10 text-ivory'
                                : 'border-gold/20 bg-navy-2/60 text-slate-2 hover:border-gold/40'
                            }`}
                          >
                            <Wallet size={14} className="mx-auto mb-1 text-gold" />
                            Pay at venue
                          </button>
                          <button
                            type="button"
                            onClick={() => set('paymentMethod', 'momo')}
                            className={`py-3 px-3 rounded-xl text-xs font-medium border-2 transition-all ${
                              form.paymentMethod === 'momo'
                                ? 'border-gold bg-gold/10 text-ivory'
                                : 'border-gold/20 bg-navy-2/60 text-slate-2 hover:border-gold/40'
                            }`}
                          >
                            <CreditCard size={14} className="mx-auto mb-1 text-gold" />
                            Pay now via MoMo
                          </button>
                        </div>
                      </div>

                      {payingNow && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl bg-gold/5 border border-gold/20 p-4 space-y-3"
                        >
                          <p className="text-[11px] text-slate-2 leading-relaxed">
                            Send <span className="font-bold text-gold">GH₵{tournament.entryFee}</span> to:
                          </p>
                          <div className="bg-navy/60 rounded-lg p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-mono text-base font-bold text-ivory tracking-wide">
                                {MOMO_NUMBER}
                              </p>
                              <p className="text-[10px] text-slate-2 truncate">{MOMO_NAME}</p>
                            </div>
                            <button
                              type="button"
                              onClick={copyMomo}
                              className="w-9 h-9 rounded-lg border border-gold/20 flex items-center justify-center
                                         text-gold hover:bg-gold/10 transition-all flex-shrink-0"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                              MoMo Transaction Reference *
                            </label>
                            <input
                              type="text"
                              value={form.paymentReference}
                              onChange={(e) => set('paymentReference', e.target.value)}
                              placeholder="e.g. 1234567890 or last 4 digits"
                              className={inputCls}
                            />
                            <p className="text-[10px] text-slate-2/60 mt-1">
                              Staff will verify this against the MoMo log before confirming your spot.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-2 tracking-wide block mb-1.5">
                      Note <span className="font-normal opacity-50">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={form.note}
                      onChange={(e) => set('note', e.target.value)}
                      placeholder="e.g. bringing a friend, preferred timing, etc."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="btn-gold w-full text-sm py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? 'Registering...'
                      : payingNow
                        ? 'Complete Registration'
                        : hasFee
                          ? 'Reserve My Spot'
                          : 'Register'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
