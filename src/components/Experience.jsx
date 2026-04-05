import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const IMG_PS5 = 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=900&auto=format&fit=crop&q=85'

const games = [
  { title: 'EA Sports FC 26',      genre: 'Football',        players: '1–2', emoji: '⚽' },
  { title: 'God of War Ragnarök',  genre: 'Action-Adventure',players: '1',   emoji: '⚔️' },
  { title: 'NBA 2K25',             genre: 'Basketball',      players: '1–4', emoji: '🏀' },
  { title: 'Mortal Kombat 11',      genre: 'Fighting',        players: '1–2', emoji: '🥊' },
  { title: 'GTA V',       genre: 'Open World',      players: '1–2', emoji: '🚗' },
  { title: 'Spider-Man 2',         genre: 'Action',          players: '1',   emoji: '🕷️' },
  // { title: 'Tekken 8',             genre: 'Fighting',        players: '1–2', emoji: '👊' },
]

const features = [
  { label: '4K OLED Displays',      desc: 'Crystal-clear visuals on every station' },
  { label: 'DualSense Controllers', desc: 'Full haptic feedback and adaptive triggers' },
  { label: 'Ergonomic Seating',     desc: 'Gaming chairs built for long comfortable sessions' },
  { label: 'Fast Starlink Wi-Fi',      desc: 'Dedicated connection for customers' },
  { label: 'Cool AC Environment',   desc: 'Climate-controlled lounge all day, every day' },
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

export default function Experience() {
  return (
    <section id="experience" className="section-pad section-ivory dark:section-ivory">
      <div className="container-main">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">What We Offer</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-5">
              Games & <span className="gold-text italic">Experience</span>
            </h2>
            <div className="divider-gold mx-auto mb-5" />
            <p className="text-base text-slate dark:text-slate-2 max-w-xl mx-auto">
              From intense football showdowns to cinematic single-player journeys —
              we have the titles that matter most. Some games listed below
            </p>
          </div>
        </FadeIn>

        {/* Game Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {games.map((game, i) => (
            <FadeIn key={game.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="card-glass rounded-2xl p-5 text-center cursor-default">
                <div className="text-3xl mb-3">{game.emoji}</div>
                <p className="font-display font-semibold text-sm text-navy dark:text-ivory leading-snug mb-1">
                  {game.title}
                </p>
                <p className="text-[10px] text-gold font-semibold tracking-widest uppercase mb-1">{game.genre}</p>
                <p className="text-[10px] text-slate dark:text-slate-2">
                  {game.players} {game.players === '1' ? 'player' : 'players'}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Setup section — image + features */}
        <FadeIn delay={0.1}>
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-navy dark:bg-navy-2 rounded-3xl
                          overflow-hidden shadow-navy border border-gold/10">
            {/* Image */}
            <div className="relative h-64 lg:h-full min-h-[280px]">
              <img src={IMG_PS5} alt="PS5 console setup"
                className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/70 lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent lg:hidden" />
              <div className="absolute bottom-5 left-5">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold/80">
                  The Rahitalu Setup
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="p-8 lg:p-10">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
                Built for <span className="gold-text italic">Champions.</span>
              </h3>
              <p className="text-sm text-slate-2 mb-7">
                Every station is built to deliver a premium experience without compromise.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {features.map((f, i) => (
                  <motion.div key={f.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold-gradient flex-shrink-0 mt-0.5
                                    flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#0A1628" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ivory mb-0.5">{f.label}</p>
                      <p className="text-xs text-slate-2 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
