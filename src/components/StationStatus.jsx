import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Monitor, Wifi, X, Gamepad2, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getTVStatus, getTVGameLists } from '../services/api'

const STATUS_COLORS = {
  idle:     'bg-emerald-400',
  active:   'bg-gold',
}

function useCountdown() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

function formatRemaining(sec) {
  if (!sec || sec <= 0) return null
  const m = Math.floor(sec / 60)
  return `${m}m left`
}

export default function StationStatus() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [gameLists, setGameLists] = useState([])
  const [selectedTV, setSelectedTV] = useState(null)
  const now = useCountdown()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const { setBookingOpen } = useApp()

  // Fetch live status every 15 seconds
  useEffect(() => {
    let mounted = true

    const fetchStatus = async () => {
      try {
        const data = await getTVStatus()
        if (mounted) setStations(data.data || [])
      } catch {
        // silently fail — show empty
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 15000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  // Fetch game lists once
  useEffect(() => {
    getTVGameLists()
      .then(data => setGameLists(data.data || []))
      .catch(() => {})
  }, [])

  const available = stations.filter(s => s.status === 'idle').length
  const occupied  = stations.filter(s => s.status === 'active').length

  // Opening time countdown
  const opening = new Date(); opening.setHours(10, 0, 0, 0)
  if (now >= opening) opening.setDate(opening.getDate() + 1)
  const isOpen = now.getHours() >= 8 && now.getHours() < 24

  return (
    <section className="section-pad section-light dark:section-light">
      <div className="container-main" ref={ref}>

        <motion.div initial={{ opacity:0, y:28 }}
          animate={isInView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Live Status</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-4">
            Station <span className="gold-text italic">Availability</span>
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        {/* Status bar */}
        <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.6, delay:0.1 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">

          <div className="card-glass p-5 text-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
              isOpen ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-500 dark:bg-red-900/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {isOpen ? 'Open Now' : 'Closed'}
            </div>
            <p className="text-xs text-slate dark:text-slate-2">10AM – 12PM Daily</p>
          </div>

          <div className="card-glass p-5 text-center">
            <p className="font-display text-4xl font-bold text-emerald-500 leading-none">{available}</p>
            <p className="text-xs text-slate dark:text-slate-2 mt-1 tracking-wide">Stations Free</p>
          </div>

          <div className="card-glass p-5 text-center">
            <p className="font-display text-4xl font-bold gold-text leading-none">{occupied}</p>
            <p className="text-xs text-slate dark:text-slate-2 mt-1 tracking-wide">In Session</p>
          </div>
        </motion.div>

        {/* Station grid */}
        <motion.div initial={{ opacity:0 }} animate={isInView ? { opacity:1 } : {}}
          transition={{ duration:0.6, delay:0.2 }}
          className="grid grid-cols-5 md:grid-cols-5 gap-3 max-w-2xl mx-auto mb-10">
          {loading ? (
            Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="rounded-xl p-3 bg-white/50 dark:bg-navy-2/50 border border-gold/10 animate-pulse h-20" />
            ))
          ) : stations.map((s, i) => {
            const tvGames = gameLists.find(g => g.tvNumber === s.tvNumber)?.games || []
            return (
            <motion.div key={s.tvNumber} initial={{ scale:0 }}
              animate={isInView ? { scale:1 } : {}}
              transition={{ delay:0.25 + i * 0.04, type:'spring', stiffness:300 }}
              onClick={() => setSelectedTV(s.tvNumber)}
              className={`rounded-xl p-3 text-center transition-all duration-300 cursor-pointer
                ${s.status === 'idle'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:shadow-md hover:scale-105'
                  : 'bg-white dark:bg-navy-2 border border-gold/20 hover:shadow-md hover:scale-105'
                }`}>
              <Monitor size={16} className={`mx-auto mb-1 ${s.status === 'idle' ? 'text-emerald-500' : 'text-gold/60'}`} />
              <p className="text-[10px] font-bold text-navy dark:text-ivory/80">TV {s.tvNumber}</p>
              <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${s.status === 'idle' ? STATUS_COLORS.idle : STATUS_COLORS.active}`} />
              {s.status === 'active' && s.timeRemainingSec > 0 && (
                <p className="text-[8px] text-slate mt-0.5">{formatRemaining(s.timeRemainingSec)}</p>
              )}
              {s.status === 'idle' && (
                <p className="text-[8px] text-emerald-500 mt-0.5">Free</p>
              )}
              {tvGames.length > 0 && (
                <p className="text-[7px] text-gold/70 mt-0.5 flex items-center justify-center gap-0.5">
                  <Gamepad2 size={8} /> {tvGames.length} games
                </p>
              )}
            </motion.div>
          )})}
        </motion.div>

        {/* Legend & CTA */}
        <motion.div initial={{ opacity:0, y:16 }} animate={isInView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.6, delay:0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-6">
            {[['bg-emerald-400','Available'], ['bg-gold','In Session']].map(([bg, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${bg}`} />
                <span className="text-xs text-slate dark:text-slate-2">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate dark:text-slate-2">
            <Wifi size={12} className="text-gold" />
            <span>Updates every 15s · tap a free station to book</span>
          </div>
        </motion.div>

      </div>

      {/* TV Game List Drawer */}
      <AnimatePresence>
        {selectedTV && (() => {
          const tvStation = stations.find(s => s.tvNumber === selectedTV)
          const tvGames = gameLists.find(g => g.tvNumber === selectedTV)?.games || []
          const isIdle = tvStation?.status === 'idle'

          return (
            <motion.div
              key="game-drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setSelectedTV(null)}
            >
              <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />

              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full sm:max-w-md bg-ivory dark:bg-navy-2 rounded-t-3xl sm:rounded-3xl
                           shadow-gold-lg border border-gold/20 overflow-hidden max-h-[80vh]"
              >
                <div className="h-1 w-full bg-gold-gradient" />

                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-gold/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isIdle
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-gold/10 border border-gold/20'
                      }`}>
                        <Monitor size={18} className={isIdle ? 'text-emerald-500' : 'text-gold'} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy dark:text-ivory">
                          Station {selectedTV}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-emerald-400' : 'bg-gold'}`} />
                          <span className="text-[11px] text-slate">{isIdle ? 'Available' : 'In Session'}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedTV(null)}
                      className="w-8 h-8 rounded-xl border border-gold/20 flex items-center justify-center
                                 text-slate hover:text-navy dark:hover:text-ivory hover:bg-gold/10 transition-all">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Game List */}
                <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 size={14} className="text-gold" />
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate">
                      Games Available ({tvGames.length})
                    </p>
                  </div>

                  {tvGames.length === 0 ? (
                    <div className="py-8 text-center">
                      <Gamepad2 size={28} className="mx-auto text-slate/30 mb-2" />
                      <p className="text-sm text-slate/60">No games listed for this station yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {tvGames.map((game, idx) => (
                        <div key={game._id || idx}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                     bg-ivory-2 dark:bg-navy border border-gold/10
                                     hover:border-gold/20 transition-colors">
                          <span className="text-[10px] text-slate/40 w-4 text-right font-mono">{idx + 1}</span>
                          <span className="text-sm font-medium text-navy dark:text-ivory flex-1">{game.name}</span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                                         bg-gold/10 text-gold/70 border border-gold/10">
                            {game.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Book CTA */}
                {isIdle && (
                  <div className="px-6 pb-5 pt-2 border-t border-gold/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedTV(null); setBookingOpen(true) }}
                      className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      Book This Station <ChevronRight size={14} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
