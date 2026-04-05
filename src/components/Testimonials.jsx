import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Kofi Mensah',
    role: 'Level 300, Computer Science',
    avatar: 'KM',
    rating: 5,
    text: "After lectures I just cross to Science Roundabout and decompress at Rahitalu. The PS5 setup is insane — 4K screen, DualSense vibrations actually working properly. GHS 15 for an hour is genuinely fair for what you get.",
    color: 'from-navy-3 to-navy-2',
  },
  {
    name: 'Ama Owusu',
    role: 'Final Year, Business Admin',
    avatar: 'AO',
    rating: 5,
    text: 'Me and my coursemates come here every Friday for FIFA. The place is really clean, the AC is cold, and the staff are chill. Feels premium but it\'s right here on campus. No stress booking too.',
    color: 'from-navy-4 to-navy-3',
  },
  {
    name: 'Yaw Darko',
    role: 'Graduate Student',
    avatar: 'YD',
    rating: 5,
    text: 'Played God of War here and I swear the DualSense made it feel different. The VIP Corner is worth it — proper comfort, bigger screen. They even have drinks so you don\'t have to pause your session.',
    color: 'from-navy-2 to-navy-3',
  },
  {
    name: 'Akosua Frimpong',
    role: 'Level 200, Engineering',
    avatar: 'AF',
    rating: 5,
    text: 'I only planned to stay an hour but ended up doing three 😭 The atmosphere is too nice — cold AC, good music, snacks available. Honestly didn\'t expect something this good to be at UCC.',
    color: 'from-navy-3 to-navy-4',
  },
  {
    name: 'Emmanuel Asante',
    role: 'Alumni, Class of 2024',
    avatar: 'EA',
    rating: 5,
    text: 'I graduated last year but anytime I\'m back in Cape Coast I pass by Rahitalu. Science Roundabout location is very convenient. The quality hasn\'t dropped at all — still the best gaming spot in the area.',
    color: 'from-navy-4 to-navy-2',
  },
]

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14}
          className={i < count ? 'text-gold fill-gold' : 'text-slate/30'}
          strokeWidth={1.5} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent(c => (c + 1) % reviews.length)

  const visible = [
    reviews[(current + reviews.length - 1) % reviews.length],
    reviews[current],
    reviews[(current + 1) % reviews.length],
  ]

  return (
    <section className="section-pad section-ivory dark:section-ivory overflow-hidden" ref={ref}>
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-4">
            What Gamers <span className="gold-text italic">Are Saying.</span>
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        {/* Cards — desktop 3-up, mobile single */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}>

          {/* Desktop carousel */}
          <div className="hidden md:grid grid-cols-3 gap-5 max-w-5xl mx-auto mb-8">
            {visible.map((r, idx) => (
              <motion.div
                key={r.name + idx}
                animate={{ scale: idx === 1 ? 1 : 0.94, opacity: idx === 1 ? 1 : 0.55 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="card-glass p-6 flex flex-col gap-4 cursor-pointer"
                onClick={() => { if (idx === 0) prev(); if (idx === 2) next() }}>
                <Quote size={24} className="text-gold/40" />
                <p className="text-sm text-slate dark:text-slate-2 leading-relaxed flex-1">{r.text}</p>
                <div>
                  <Stars count={r.rating} />
                  <div className="flex items-center gap-2.5 mt-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.color}
                                    flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-bold text-gold">{r.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy dark:text-ivory">{r.name}</p>
                      <p className="text-[10px] text-slate dark:text-slate-2">{r.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile single card */}
          <div className="md:hidden max-w-sm mx-auto mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                className="card-glass p-6 flex flex-col gap-4">
                <Quote size={24} className="text-gold/40" />
                <p className="text-sm text-slate dark:text-slate-2 leading-relaxed">{reviews[current].text}</p>
                <div>
                  <Stars count={reviews[current].rating} />
                  <div className="flex items-center gap-2.5 mt-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${reviews[current].color}
                                    flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-bold text-gold">{reviews[current].avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy dark:text-ivory">{reviews[current].name}</p>
                      <p className="text-[10px] text-slate dark:text-slate-2">{reviews[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5">
            <button onClick={prev}
              className="w-10 h-10 rounded-xl border border-gold/25 flex items-center justify-center
                         text-slate dark:text-slate-2 hover:border-gold hover:text-gold transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-gold/25 hover:bg-gold/50'
                  }`} />
              ))}
            </div>
            <button onClick={next}
              className="w-10 h-10 rounded-xl border border-gold/25 flex items-center justify-center
                         text-slate dark:text-slate-2 hover:border-gold hover:text-gold transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
