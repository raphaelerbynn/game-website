import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Trophy, Swords, Users, Calendar, Clock, Shield, Zap, ChevronRight, Bell } from 'lucide-react'
import TournamentRegModal from './TournamentRegModal'

const tournaments = [
  {
    id: 'fc26',
    emoji: '⚽',
    game: 'EA Sports FC 26',
    subtitle: 'Football Tournament',
    format: '1v1 Knockout Bracket',
    players: 'Up to 32 Players',
    rounds: 'Knockout → Final',
    prize: 'Prize Pool — TBA',
    date: 'Date TBD',
    highlight: true,
    color: 'from-emerald-900/40 to-navy',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    badgeCls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    rules: ['Fair play required', 'Rahitalu station only', 'No modded controllers'],
  },
  {
    id: 'mk',
    emoji: '🥊',
    game: 'Mortal Kombat',
    subtitle: 'Fighting Tournament',
    format: '1v1 Double Elimination',
    players: 'Up to 32 Players',
    rounds: 'Winners + Losers Bracket',
    prize: 'Prize Pool — TBA',
    date: 'Date TBD',
    highlight: false,
    color: 'from-red-900/40 to-navy',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/20',
    badgeCls: 'bg-red-500/10 text-red-400 border border-red-500/20',
    rules: ['All fighters allowed', 'Rahitalu station only', 'Best of 3 per match'],
  },
]

const howItWorks = [
  { icon: Bell,      step: '01', title: 'Register Interest', desc: 'Sign up to be notified the moment registration opens.' },
  { icon: Users,     step: '02', title: 'Confirm Your Slot',  desc: 'Secure your spot once registration goes live. Limited seats.' },
  { icon: Swords,    step: '03', title: 'Compete & Win',      desc: 'Show up, play your game, and claim the prize.' },
]

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function Tournament() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  const openRegModal = (gameId) => {
    setSelectedGame(gameId)
    setModalOpen(true)
  }

  return (
    <>
      <section id="tournament" className="section-pad bg-navy dark:bg-navy relative overflow-hidden">

        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

        <div className="container-main relative z-10">

          {/* Section Header */}
          <FadeIn>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6">
                <Trophy size={13} className="text-gold" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold">Tournaments</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ivory mb-5">
                Compete for
                <span className="gold-text italic"> Glory.</span>
              </h2>
              <div className="divider-gold mx-auto mb-5" />
              <p className="text-base text-slate-2 max-w-lg mx-auto">
                Rahitalu Game Lounge is bringing structured tournaments to campus.
                Register your interest now — spots will be limited.
              </p>
            </div>
          </FadeIn>

          {/* Coming Soon banner */}
          <FadeIn delay={0.05}>
            <div className="flex items-center justify-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30
                              rounded-2xl px-6 py-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
                </span>
                <span className="text-sm font-bold text-gold tracking-wide">Coming Soon — Registration Opening Soon</span>
              </div>
            </div>
          </FadeIn>

          {/* Tournament Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
            {tournaments.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 280 }}
                  className={`relative rounded-3xl overflow-hidden border ${t.borderColor} h-full flex flex-col`}
                  style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)' }}>

                  {/* Card top accent */}
                  <div className={`h-1 w-full ${t.highlight ? 'bg-gold-gradient' : 'bg-gradient-to-r from-red-600 to-red-400'}`} />

                  <div className="p-7 flex flex-col flex-1">

                    {/* Game header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{t.emoji}</div>
                        <div>
                          <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5 ${t.accentColor}`}>
                            {t.subtitle}
                          </p>
                          <h3 className="font-display text-xl font-bold text-ivory leading-tight">
                            {t.game}
                          </h3>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${t.badgeCls}`}>
                        Soon
                      </span>
                    </div>

                    {/* Tournament details */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {[
                        { icon: Shield,   label: 'Format',  value: t.format },
                        { icon: Users,    label: 'Players', value: t.players },
                        { icon: ChevronRight, label: 'Structure', value: t.rounds },
                        { icon: Trophy,   label: 'Prize',   value: t.prize },
                        { icon: Calendar, label: 'Date',    value: t.date },
                      ].map(row => (
                        <div key={row.label} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gold/8 flex items-center justify-center flex-shrink-0">
                            <row.icon size={13} className="text-gold" strokeWidth={1.8} />
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-semibold text-slate-2 uppercase tracking-wider w-16 flex-shrink-0">
                              {row.label}
                            </span>
                            <span className="text-sm text-ivory/80 truncate">{row.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/6 mb-5" />

                    {/* Rules */}
                    <div className="mb-7">
                      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-2 mb-3">Rules</p>
                      <ul className="flex flex-col gap-2">
                        {t.rules.map(r => (
                          <li key={r} className="flex items-center gap-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                              <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                                <path d="M1 3L2.8 4.8L6 1" stroke="#D4AF37" strokeWidth="1.4"
                                  strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <span className="text-xs text-slate-2">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openRegModal(t.id)}
                      className="mt-auto btn-gold w-full text-sm py-3">
                      <span className="flex items-center justify-center gap-2">
                        <Bell size={14} />
                        Notify Me When Open
                      </span>
                    </motion.button>

                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* How It Works */}
          <FadeIn delay={0.1}>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-2">The Process</p>
              <h3 className="font-display text-2xl font-bold text-ivory">How It Works</h3>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {howItWorks.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="relative text-center px-6 py-7 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 -right-3 z-10">
                      <ChevronRight size={18} className="text-gold/30" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center
                                  justify-center mx-auto mb-4">
                    <step.icon size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] font-bold text-gold/50 tracking-widest mb-1">{step.step}</p>
                  <h4 className="font-display font-bold text-ivory text-base mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-2 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Bottom CTA */}
          <FadeIn delay={0.2}>
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openRegModal(null)}
                className="btn-gold text-sm px-8 py-3.5 inline-flex items-center gap-2">
                <Zap size={15} />
                Pre-Register for Any Tournament
              </motion.button>
              <p className="text-xs text-slate-2 mt-4">
                Be the first to know when registration opens.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      <TournamentRegModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultGame={selectedGame}
      />
    </>
  )
}
