import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Gamepad2, Timer } from 'lucide-react'
import { useApp } from '../context/AppContext'

const hourlyPlans = [
  {
    name: 'Quick Play',
    duration: '30 Min',
    price: 10,
    currency: 'GH₵',
    tag: null,
    features: [
      'Full PS5 Access',
      'Adventure Games',
      'DualSense Controller',
      'Comfortable Seating',
    ],
    highlight: false,
  },
  {
    name: 'The Standard',
    duration: '1 Hour',
    price: 20,
    currency: 'GH₵',
    tag: null,
    features: [
      'Full PS5 Access',
      'Adventure Games',
      'DualSense Controller',
      'Comfortable Seating',
    ],
    highlight: false,
  },
  {
    name: 'The Chill',
    duration: '2 Hours',
    price: 40,
    currency: 'GH₵',
    tag: 'Most Popular',
    features: [
      'Full PS5 Access',
      'Adventure Games',
      'DualSense Controller',
      'Comfortable Seating',
      'Free Bottle Water',
    ],
    highlight: true,
  },
  {
    name: 'The Elite',
    duration: '3+ Hours',
    price: 60,
    currency: 'GH₵',
    tag: 'Best Value',
    features: [
      'Full PS5 Access',
      'Adventure Games',
      'DualSense Controller',
      'Comfortable Seating',
      '2 Free Drinks',
      'Snacks (Coming Soon)',
    ],
    highlight: false,
  },
]

const perGamePricing = [
  { game: 'FC 26/25 (Football)',       price: 10, soloPrice: 6, currency: 'GH₵', highlight: true,  unavailable: false },
  { game: 'NBA 2K26 (Basketball)',  price: 8,  soloPrice: 5, currency: 'GH₵', highlight: false, unavailable: true },
  { game: 'Car Racing',            price: 8,  soloPrice: 5, currency: 'GH₵', highlight: false, unavailable: true },
  { game: 'Mortal Kombat',         price: 6,  soloPrice: 4, currency: 'GH₵', highlight: false, unavailable: false },
  { game: 'Arcade Games',          price: 6,  soloPrice: 4, currency: 'GH₵', highlight: false, unavailable: false },
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

export default function Pricing() {
  const { setBookingOpen } = useApp()

  return (
    <section id="pricing" className="section-pad section-light dark:section-light">
      <div className="container-main">

        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Sessions & Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-5">
              Play Your Way,
              <span className="gold-text italic"> Pay Less.</span>
            </h2>
            <div className="divider-gold mx-auto mb-5" />
            <p className="text-base text-slate dark:text-slate-2 max-w-lg mx-auto">
              Transparent, fair pricing for every kind of gamer. No hidden fees —
              just pure, uninterrupted play.
            </p>
          </div>
        </FadeIn>

        {/* Per-Game Pricing */}
        <FadeIn delay={0.05}>
          <div className="flex items-center gap-2 mb-6">
            <Gamepad2 size={20} className="text-gold" />
            <h3 className="font-display text-2xl font-bold text-navy dark:text-ivory">Per Game</h3>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-16">
          {perGamePricing.map((item, i) => (
            <FadeIn key={item.game} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: item.unavailable ? 0 : -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative rounded-2xl p-6 text-center h-full flex flex-col items-center
                  ${item.unavailable
                    ? 'card-glass text-navy dark:text-ivory opacity-60'
                    : item.highlight
                      ? 'bg-navy dark:bg-navy-2 text-ivory shadow-gold-lg border border-gold/30'
                      : 'card-glass text-navy dark:text-ivory'
                  }`}>
                {item.unavailable && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-slate-500
                                     text-white text-[9px] font-bold tracking-widest
                                     uppercase px-3 py-1 rounded-full shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
                {item.highlight && !item.unavailable && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gold-gradient
                                     text-navy text-[9px] font-bold tracking-widest
                                     uppercase px-3 py-1 rounded-full shadow-gold">
                      <Zap size={9} />
                      Popular
                    </span>
                  </div>
                )}
                <p className={`text-sm font-semibold mb-3 ${item.highlight ? 'text-ivory' : 'text-navy dark:text-ivory'}`}>
                  {item.game}
                </p>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className={`text-xs font-medium ${item.highlight ? 'text-ivory/50' : 'text-slate dark:text-slate-2'}`}>
                    {item.currency}
                  </span>
                  <span className={`font-display text-4xl font-bold leading-none ${item.highlight ? 'text-ivory' : 'text-navy dark:text-ivory'}`}>
                    {item.price}
                  </span>
                </div>
                <p className={`text-xs mb-1 ${item.highlight ? 'text-ivory/60' : 'text-slate dark:text-slate-2'}`}>
                  per game <span className="font-medium">(2 players)</span>
                </p>
                <p className={`text-xs font-semibold ${item.highlight ? 'text-gold' : 'text-gold'}`}>
                  1 Player: {item.currency}{item.soloPrice}
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Check size={10} className="text-gold" strokeWidth={2.5} />
                  <span className={`text-xs ${item.highlight ? 'text-ivory/70' : 'text-slate dark:text-slate-2'}`}>
                    Comfortable Seating
                  </span>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Hourly Adventure Sessions */}
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-2 mb-6">
            <Timer size={20} className="text-gold" />
            <h3 className="font-display text-2xl font-bold text-navy dark:text-ivory">Hourly Sessions <span className="text-base font-normal text-slate dark:text-slate-2">— Adventure Games</span></h3>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-5xl mx-auto">
          {hourlyPlans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: plan.highlight ? -4 : -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative rounded-3xl p-8 h-full flex flex-col
                  ${plan.highlight
                    ? 'bg-navy dark:bg-navy-2 text-ivory shadow-gold-lg border border-gold/30'
                    : 'card-glass text-navy dark:text-ivory'
                  }`}>

                {/* Popular badge */}
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-gold-gradient
                                     text-navy text-[10px] font-bold tracking-widest
                                     uppercase px-4 py-1.5 rounded-full shadow-gold">
                      <Zap size={10} />
                      {plan.tag}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-1 text-gold`}>
                    {plan.duration}
                  </p>
                  <h3 className={`font-display text-xl font-bold mb-4 ${plan.highlight ? 'text-ivory' : 'text-navy dark:text-ivory'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1">
                    <span className={`text-sm font-medium ${plan.highlight ? 'text-ivory/50' : 'text-slate dark:text-slate-2'}`}>
                      {plan.currency}
                    </span>
                    <span className={`font-display text-5xl font-bold leading-none ${plan.highlight ? 'text-ivory' : 'text-navy dark:text-ivory'}`}>
                      {plan.price}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${plan.highlight ? 'bg-white/10' : 'bg-gold/15'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center
                        ${plan.highlight ? 'bg-gold/20' : 'bg-gold/10'}`}>
                        <Check size={9} className="text-gold" strokeWidth={2.5} />
                      </div>
                      <span className={`text-sm ${plan.highlight ? 'text-ivory/80' : 'text-slate dark:text-slate-2'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => setBookingOpen(true)}
                  className={plan.highlight ? 'btn-gold w-full text-sm py-3' : 'btn-outline-navy w-full text-sm py-3'}>
                  Book Now
                </button>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Note */}
        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-slate dark:text-slate-2 mt-8">
            Group bookings and special events available.{' '}
            <a href="#contact" className="text-gold font-medium hover:underline">Contact us</a>{' '}
            for custom packages.
          </p>
        </FadeIn>

      </div>
    </section>
  )
}
