import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { ChevronDown, Gamepad2, Star, Users, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const IMG = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1800&auto=format&fit=crop&q=85'

const stats = [
  { icon: Gamepad2, value: '20+',  label: 'PS5 Titles'    },
  { icon: Users,    value: '100+', label: 'Happy Gamers'  },
  { icon: Star,     value: '4.9',  label: 'Star Rating'   },
  { icon: Zap,      value: '10AM',  label: 'Opens Daily'   },
]

const v = (i, y=40) => ({
  initial: { opacity:0, y },
  animate: { opacity:1, y:0, transition:{ delay:i*0.15, duration:0.85, ease:[0.22,1,0.36,1] } }
})

export default function Hero() {
  const { setBookingOpen } = useApp()

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img src={IMG} alt="Gaming lounge" className="w-full h-full object-cover" />
        {/* Layered overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-transparent to-navy/20" />
      </div>

      {/* Animated gold accent lines */}
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ delay:1.2, duration:1.2, ease:[0.22,1,0.36,1] }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gold-gradient origin-left" />

      {/* Content */}
      <div className="relative z-10 container-main px-6 pb-20 pt-32">
        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div {...v(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-white/10 backdrop-blur-sm border border-gold/30 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gold">
              Now Open · Science Roundabout, Cape Coast
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 {...v(1)}
            className="font-display font-bold leading-[1.05] mb-5 text-white">
            <span className="block text-5xl md:text-7xl lg:text-8xl">Rahitalu</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl shimmer-text italic">Game Lounge</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p {...v(2)}
            className="font-display text-xl md:text-2xl text-gold/90 italic font-light mb-4 tracking-wide">
            Elevate Your Game.
          </motion.p>

          {/* Sub */}
          <motion.p {...v(3)}
            className="text-base md:text-lg text-white/65 font-light leading-relaxed max-w-lg mb-10">
            Cape Coast's most premium PS5 gaming destination. Where every session
            is an experience crafted for those who demand the best.
          </motion.p>

          {/* Buttons */}
          <motion.div {...v(4)} className="flex flex-col sm:flex-row gap-4">
            <button className="btn-gold text-base px-8 py-3.5" onClick={() => setBookingOpen(true)}>
              Book a Session
            </button>
            <Link to="experience" smooth duration={600} offset={-72}>
              <button className="btn-outline-navy text-base px-8 py-3.5 w-full sm:w-auto">
                Explore Games
              </button>
            </Link>
          </motion.div>

        </div>

        {/* Stats bar */}
        <motion.div {...v(5, 20)}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label}
              className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-none">{value}</p>
                <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <Link to="ticker" smooth duration={400} className="cursor-pointer">
          <div className="flex flex-col items-center gap-1 text-white/40 hover:text-gold transition-colors">
            <span className="text-[9px] tracking-[0.2em] uppercase">Scroll</span>
            <ChevronDown size={14} />
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
