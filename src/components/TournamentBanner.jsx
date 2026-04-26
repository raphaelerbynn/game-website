import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, X, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const GAME_LABELS = {
  fc25: 'FC 25',
  fc26: 'FC 26',
  mk:   'Mortal Kombat',
}

const formatWhen = (iso) => {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export default function TournamentBanner() {
  const { bannerTournament, dismissTournamentBanner, openTournamentRegistration } = useApp()

  if (!bannerTournament) return null

  const t = bannerTournament
  const isLive = t.status === 'in-progress'
  const slots = t.slotsLeft
  const slotsTextLong = isLive ? 'LIVE NOW' : slots <= 3 ? `Only ${slots} slots left!` : `${slots} slots left`
  const slotsTextShort = isLive ? 'LIVE' : `${slots} left`

  const handleClick = () => {
    if (t.status === 'open') openTournamentRegistration(t)
  }

  return (
    <AnimatePresence>
      <motion.div
        key={t._id}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-gold via-amber-400 to-gold text-navy shadow-lg"
      >
        <div className="container-main px-4 sm:px-6 h-11 flex items-center gap-3">
          <Trophy size={16} strokeWidth={2.25} className="flex-shrink-0" />

          <button
            onClick={handleClick}
            className="flex-1 min-w-0 flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
          >
            <span className="text-[11px] font-bold tracking-widest uppercase hidden sm:inline">
              {isLive ? 'Live' : 'Tournament'}
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate">
              {t.name}
            </span>
            <span className="text-[11px] sm:text-xs opacity-80 hidden md:inline">
              · {GAME_LABELS[t.gameType] || t.gameType} · {formatWhen(t.scheduledAt)}
            </span>
            <span
              className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${
                isLive
                  ? 'bg-red-600 text-white animate-pulse'
                  : slots <= 3
                    ? 'bg-navy text-ivory'
                    : 'bg-navy/10 text-navy'
              }`}
            >
              <span className="hidden sm:inline">{slotsTextLong}</span>
              <span className="sm:hidden">{slotsTextShort}</span>
            </span>
            <ArrowRight size={14} className="flex-shrink-0 hidden sm:block" />
          </button>

          <button
            onClick={() => dismissTournamentBanner(t._id)}
            aria-label="Dismiss"
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-navy/10 transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
