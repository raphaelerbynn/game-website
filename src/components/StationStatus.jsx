import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Wifi } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Simulated live station data
const TOTAL = 6
const initialStations = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  status: ['available', 'occupied', 'occupied', 'reserved', 'available', 'unavailable'][i],
  timeLeft: [0, 45, 22, 0, 0, 0][i],
}))

const STATUS_COLORS = {
  available: 'bg-emerald-400',
  occupied:  'bg-gold',
  reserved:  'bg-blue-400',
  unavailable:'bg-red-400',
}

function useCountdown() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

export default function StationStatus() {
  const [stations] = useState(initialStations)
  const now = useCountdown()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const { setBookingOpen } = useApp()

  const available = stations.filter(s => s.status === 'available').length
  const occupied  = stations.filter(s => s.status === 'occupied').length

  // Opening time countdown
  const opening = new Date(); opening.setHours(10, 0, 0, 0)
  if (now >= opening) opening.setDate(opening.getDate() + 1)
  const diff   = opening - now
  const hrs    = Math.floor(diff / 3600000)
  const mins   = Math.floor((diff % 3600000) / 60000)
  const secs   = Math.floor((diff % 60000) / 1000)
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
          className="grid grid-cols-4 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
          {stations.map((s, i) => (
            <motion.div key={s.id} initial={{ scale:0 }}
              animate={isInView ? { scale:1 } : {}}
              transition={{ delay:0.25 + i * 0.04, type:'spring', stiffness:300 }}
              onClick={() => s.status === 'available' && setBookingOpen(true)}
              className={`rounded-xl p-3 text-center transition-all duration-300
                ${s.status === 'available'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:shadow-md hover:scale-105'
                  : 'bg-white dark:bg-navy-2 border border-gold/20 cursor-default'
                }`}>
              <Monitor size={16} className={`mx-auto mb-1 ${s.status === 'available' ? 'text-emerald-500' : 'text-gold/60'}`} />
              <p className="text-[10px] font-bold text-navy dark:text-ivory/80">P{s.id}</p>
              <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${STATUS_COLORS[s.status]}`} />
              {s.status === 'occupied' && s.timeLeft > 0 && (
                <p className="text-[8px] text-slate mt-0.5">{s.timeLeft}m left</p>
              )}
              {s.status === 'available' && (
                <p className="text-[8px] text-emerald-500 mt-0.5">Free</p>
              )}
            </motion.div>
          ))}
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
            <span>Updated live · tap a free station to book</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
