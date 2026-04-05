import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Zap, Coffee, Crown } from 'lucide-react'

const IMG_LOUNGE = new URL('../assets/imgs/environment.JPG', import.meta.url).href
const IMG_SETUP  = new URL('../assets/imgs/main_gamefloor.JPG', import.meta.url).href

const pillars = [
  { icon: Crown,  title: 'Luxury First',     desc: 'Every detail — seating, lighting, sound — designed to feel like royalty.' },
  { icon: Zap,    title: 'Top-Tier Setup',   desc: 'PS5 consoles, 4K displays, DualSense haptics on every station.' },
  { icon: Shield, title: 'Safe & Secure',    desc: 'A welcoming, safe environment for students and gamers at UCC and beyond.' },
  { icon: Coffee, title: 'Fully Refreshed',  desc: 'Cold drinks and snacks so your session never has to stop.' },
]

function FadeIn({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const y = direction === 'up' ? 32 : direction === 'down' ? -32 : 0
  const x = direction === 'left' ? 32 : direction === 'right' ? -32 : 0
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="section-pad section-light dark:section-light">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text side */}
          <div>
            <FadeIn delay={0}>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">Our Story</p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory leading-tight mb-6">
                More Than a Game Room.
                <br />
                <span className="gold-text italic">An Experience.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="divider-gold mb-7" />
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-base text-slate dark:text-slate-2 leading-relaxed mb-5">
                Rahitalu Game Lounge was born from a simple belief: gaming should feel special.
                Not just functional — but <em className="text-navy dark:text-ivory">memorable</em>. We set up right here at
                the University of Cape Coast to give students a world-class PS5 gaming destination
                that rivals anything in the country.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-base text-slate dark:text-slate-2 leading-relaxed mb-10">
                Whether you're deep in a solo campaign, competing with friends, or just looking
                for a place to unwind between classes — Rahitalu is your space. Refined,
                comfortable, and always ready.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="flex items-center gap-6">
                {[['2024', 'Est.'], ['UCC', 'Campus'], ['PS5', 'Exclusive']].map(([val, lbl], i) => (
                  <div key={lbl} className="flex items-center gap-6">
                    {i > 0 && <div className="w-px h-10 bg-gold/20" />}
                    <div className="text-center">
                      <p className="font-display text-3xl font-bold gold-text">{val}</p>
                      <p className="text-xs text-slate dark:text-slate-2 tracking-widest uppercase">{lbl}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Image + cards side */}
          <div className="flex flex-col gap-4">
            {/* Real image */}
            <FadeIn delay={0.1} direction="left">
              <div className="relative rounded-3xl overflow-hidden shadow-navy h-52">
                <img src={IMG_LOUNGE} alt="Gaming lounge atmosphere"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-gold/30
                                rounded-xl px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-wide">Open Daily · 10AM – 11PM</span>
                </div>
              </div>
            </FadeIn>

            {/* Pillar cards */}
            <div className="grid grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <FadeIn key={p.title} delay={0.15 + i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <div className="card-glass p-5 h-full">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center mb-3">
                      <p.icon size={17} className="text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display font-semibold text-sm text-navy dark:text-ivory mb-1.5">{p.title}</h3>
                    <p className="text-xs text-slate dark:text-slate-2 leading-relaxed">{p.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
