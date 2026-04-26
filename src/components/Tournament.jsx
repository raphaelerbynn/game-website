import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, Swords, Users, Calendar, Bell, Zap, Ticket, ChevronRight, Flame, History, Medal } from 'lucide-react'
import TournamentRegModal from './TournamentRegModal'
import PublicFixturesPanel from './fixtures/PublicFixturesPanel'
import { useApp } from '../context/AppContext'
import { getPastTournaments } from '../services/api'

const GAME_META = {
  fc26: { emoji: '⚽', label: 'EA Sports FC 26',   subtitle: 'Football Tournament', accentColor: 'text-emerald-400', borderColor: 'border-emerald-500/20', accent: 'bg-gold-gradient' },
  fc25: { emoji: '⚽', label: 'EA Sports FC 25',   subtitle: 'Football Tournament', accentColor: 'text-emerald-400', borderColor: 'border-emerald-500/20', accent: 'bg-gold-gradient' },
  mk:   { emoji: '🥊', label: 'Mortal Kombat',     subtitle: 'Fighting Tournament', accentColor: 'text-red-400',     borderColor: 'border-red-500/20',     accent: 'bg-gradient-to-r from-red-600 to-red-400' },
}

const STATUS_BADGE = {
  'open':        { label: 'Open',  cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  'in-progress': { label: 'Live',  cls: 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse' },
}

const howItWorks = [
  { icon: Bell,   step: '01', title: 'Register Interest', desc: 'Sign up to be notified the moment registration opens.' },
  { icon: Users,  step: '02', title: 'Confirm Your Slot',  desc: 'Secure your spot once registration goes live. Limited seats.' },
  { icon: Swords, step: '03', title: 'Compete & Win',      desc: 'Show up, play your game, and claim the prize.' },
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

const formatDateTime = (iso) => {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(d)
}

function TournamentCard({ t, onRegister }) {
  const meta = GAME_META[t.gameType] || { emoji: '🎮', label: t.gameType, subtitle: 'Tournament', accentColor: 'text-gold', borderColor: 'border-gold/20', accent: 'bg-gold-gradient' }
  const status = STATUS_BADGE[t.status] || STATUS_BADGE.open
  const slotsFilled = t.registrationCount || 0
  const slotsTotal = t.maxParticipants || 0
  const slotsLeft = t.slotsLeft ?? Math.max(0, slotsTotal - slotsFilled)
  const fillPct = slotsTotal > 0 ? Math.min(100, Math.round((slotsFilled / slotsTotal) * 100)) : 0
  const isLive = t.status === 'in-progress'
  const canRegister = t.status === 'open' && !t.isFull

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280 }}
      className={`relative rounded-3xl overflow-hidden border ${meta.borderColor} h-full flex flex-col`}
      style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className={`h-1 w-full ${meta.accent}`} />

      <div className="p-5 sm:p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5 gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="text-3xl sm:text-4xl flex-shrink-0">{meta.emoji}</div>
            <div className="min-w-0">
              <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5 ${meta.accentColor}`}>
                {meta.subtitle}
              </p>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ivory leading-tight truncate">
                {t.name}
              </h3>
              <p className="text-[11px] text-slate-2 mt-0.5">{meta.label}</p>
            </div>
          </div>
          <span className={`text-[9px] font-bold tracking-widest uppercase px-2 sm:px-2.5 py-1 rounded-full flex-shrink-0 ${status.cls}`}>
            {status.label}
          </span>
        </div>

        {/* Slots progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-2">
              Slots
            </span>
            {t.isFull ? (
              <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 flex items-center gap-1">
                <Flame size={10} /> Full
              </span>
            ) : slotsLeft <= 3 ? (
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
                Only {slotsLeft} left
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-2">
                {slotsLeft} left
              </span>
            )}
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full ${t.isFull ? 'bg-red-500' : slotsLeft <= 3 ? 'bg-amber-400' : 'bg-gold'}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-2 mt-1.5">
            {slotsFilled} / {slotsTotal} registered
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-2.5 mb-6">
          {[
            { icon: Calendar, label: 'When',     value: formatDateTime(t.scheduledAt) },
            { icon: Ticket,   label: 'Entry',    value: t.entryFee > 0 ? `GH₵${t.entryFee}` : 'Free' },
            { icon: Trophy,   label: 'Prize',    value: t.prizePool > 0 ? `GH₵${t.prizePool}` : 'TBA' },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gold/8 flex items-center justify-center flex-shrink-0">
                <row.icon size={13} className="text-gold" strokeWidth={1.8} />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-semibold text-slate-2 uppercase tracking-wider w-14 flex-shrink-0">
                  {row.label}
                </span>
                <span className="text-sm text-ivory/85 truncate">{row.value}</span>
              </div>
            </div>
          ))}
        </div>

        {t.description && (
          <>
            <div className="h-px bg-white/6 mb-4" />
            <p className="text-xs text-slate-2 mb-3 leading-relaxed">{t.description}</p>
          </>
        )}

        {/* Fixtures / Bracket / Table */}
        <div className="mb-5">
          <PublicFixturesPanel tournament={t} defaultOpen={isLive} />
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: canRegister ? 1.02 : 1 }}
          whileTap={{ scale: canRegister ? 0.97 : 1 }}
          onClick={() => canRegister && onRegister(t)}
          disabled={!canRegister}
          className={`mt-auto w-full text-sm py-3 rounded-xl font-semibold transition-colors ${
            t.isFull
              ? 'bg-red-500/15 text-red-400 cursor-not-allowed'
              : isLive
                ? 'bg-red-500/15 text-red-400 cursor-not-allowed'
                : 'btn-gold'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {t.isFull ? (
              <>Tournament Full</>
            ) : isLive ? (
              <>Live Now — Come Watch</>
            ) : (
              <><Bell size={14} /> Register Now</>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}

const COMING_SOON_TEASERS = [
  {
    id: 'fc-soon',
    emoji: '⚽',
    game: 'EA Sports FC 26',
    subtitle: 'Football Tournament',
    format: '1v1 Knockout',
    players: 'Up to 32 Players',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    accent: 'bg-gold-gradient',
  },
  {
    id: 'mk-soon',
    emoji: '🥊',
    game: 'Mortal Kombat',
    subtitle: 'Fighting Tournament',
    format: '1v1 Double-Elimination',
    players: 'Up to 32 Players',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/20',
    accent: 'bg-gradient-to-r from-red-600 to-red-400',
  },
]

function ComingSoonTeaserCard({ teaser, onNotify }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280 }}
      className={`relative rounded-3xl overflow-hidden border ${teaser.borderColor} h-full flex flex-col`}
      style={{ background: 'rgba(10,22,40,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className={`h-1 w-full ${teaser.accent}`} />
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-4xl">{teaser.emoji}</div>
            <div>
              <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5 ${teaser.accentColor}`}>
                {teaser.subtitle}
              </p>
              <h3 className="font-display text-xl font-bold text-ivory leading-tight">{teaser.game}</h3>
            </div>
          </div>
          <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold/8 flex items-center justify-center">
              <Swords size={13} className="text-gold" strokeWidth={1.8} />
            </div>
            <span className="text-sm text-ivory/80">{teaser.format}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold/8 flex items-center justify-center">
              <Users size={13} className="text-gold" strokeWidth={1.8} />
            </div>
            <span className="text-sm text-ivory/80">{teaser.players}</span>
          </div>
        </div>

        <div className="h-px bg-white/6 mb-5" />

        <p className="text-xs text-slate-2 mb-6 leading-relaxed">
          No active tournament right now. Pre-register to be first in line when the next one opens.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => onNotify(teaser.id.startsWith('fc') ? 'fc26' : 'mk')}
          className="mt-auto btn-gold w-full text-sm py-3"
        >
          <span className="flex items-center justify-center gap-2">
            <Bell size={14} /> Notify Me
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}

function PastTournamentsSection() {
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getPastTournaments()
      .then((res) => { if (active) setPast(Array.isArray(res?.data) ? res.data : []) })
      .catch(() => { if (active) setPast([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading || past.length === 0) return null

  return (
    <FadeIn delay={0.1}>
      <div className="max-w-4xl mx-auto mb-14">
        <div className="flex items-center gap-2 mb-6">
          <History size={16} className="text-gold/80" />
          <h3 className="font-display text-lg font-bold text-ivory tracking-wide">Past Tournaments</h3>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {past.map((p) => {
            const meta = GAME_META[p.gameType] || GAME_META.fc26
            const when = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            }).format(new Date(p.scheduledAt))
            return (
              <div
                key={p._id}
                className="rounded-2xl border border-gold/10 bg-navy-2/40 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-2/70">{when}</span>
                  {p.status === 'cancelled' && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-red-400/80">Cancelled</span>
                  )}
                </div>
                <h4 className="text-sm font-display font-bold text-ivory truncate mb-1">{p.name}</h4>
                <p className="text-[11px] text-slate-2 mb-2">
                  {p.registrationCount || 0} players · {meta.label}
                </p>
                {p.winner ? (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Medal size={12} className="text-gold" />
                    <span className="text-gold font-semibold truncate">{p.winner.name}</span>
                  </div>
                ) : p.status === 'cancelled' ? (
                  <p className="text-[11px] text-slate-2/50 italic">Did not take place</p>
                ) : (
                  <p className="text-[11px] text-slate-2/50 italic">No winner recorded</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </FadeIn>
  )
}

function ComingSoonEmpty({ onNotify }) {
  return (
    <>
      <FadeIn delay={0.05}>
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-2xl px-6 py-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
            </span>
            <span className="text-sm font-bold text-gold tracking-wide">
              Tournaments Coming Soon
            </span>
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
        {COMING_SOON_TEASERS.map((t, i) => (
          <FadeIn key={t.id} delay={0.05 + i * 0.08}>
            <ComingSoonTeaserCard teaser={t} onNotify={onNotify} />
          </FadeIn>
        ))}
      </div>
    </>
  )
}

export default function Tournament() {
  const { tournaments, tournamentsLoading, openTournamentRegistration } = useApp()
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [waGame, setWaGame] = useState(null)

  const openWaPreRegister = (gameId) => {
    setWaGame(gameId)
    setWaModalOpen(true)
  }

  const hasTournaments = !tournamentsLoading && tournaments.length > 0

  return (
    <>
      <section id="tournament" className="section-pad bg-navy dark:bg-navy relative overflow-hidden">

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

        <div className="container-main relative z-10">

          {/* Header */}
          <FadeIn>
            <div className="text-center mb-10">
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
                Live tournaments, real prizes. See what&apos;s coming up, grab your slot before it&apos;s gone.
              </p>
            </div>
          </FadeIn>

          {tournamentsLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasTournaments ? (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
              {tournaments.map((t, i) => (
                <FadeIn key={t._id} delay={i * 0.08}>
                  <TournamentCard t={t} onRegister={openTournamentRegistration} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <ComingSoonEmpty onNotify={openWaPreRegister} />
          )}

          {/* Past tournaments */}
          <PastTournamentsSection />

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

          {/* Pre-register any CTA */}
          <FadeIn delay={0.2}>
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openWaPreRegister(null)}
                className="btn-gold text-sm px-8 py-3.5 inline-flex items-center gap-2">
                <Zap size={15} />
                Pre-Register for Future Tournaments
              </motion.button>
              <p className="text-xs text-slate-2 mt-4">
                Be the first to know when a new tournament opens.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      <TournamentRegModal
        open={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        defaultGame={waGame}
      />
    </>
  )
}
