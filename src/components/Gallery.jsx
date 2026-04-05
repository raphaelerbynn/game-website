import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, Expand } from 'lucide-react'

const photos = [
  {
    id: 1, span: 'md:col-span-2 md:row-span-2',
    src: new URL('../assets/imgs/main_gamefloor.JPG', import.meta.url).href,
    label: 'Main Gaming Floor',
  },
  {
    id: 2, span: '',
    src: new URL('../assets/imgs/controller.JPG', import.meta.url).href,
    label: 'PS5 Controller',
  },
  {
    id: 3, span: '',
    src: new URL('../assets/imgs/upclose.JPG', import.meta.url).href,
    label: 'PS5 Close-Up',
  },
  {
    id: 4, span: '',
    src: new URL('../assets/imgs/4kview.JPG', import.meta.url).href,
    label: '4K Display Setup',
  },
  {
    id: 5, span: '',
    src: new URL('../assets/imgs/gaming_atmosphere.JPG', import.meta.url).href,
    label: 'Gaming Atmosphere',
  },
  {
    id: 6, span: 'md:col-span-2',
    src: new URL('../assets/imgs/ps5.JPG', import.meta.url).href,
    label: 'Premium Station',
  },
]

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export default function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="gallery" className="section-pad section-ivory dark:section-ivory">
      <div className="container-main">

        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">The Space</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-5">
              See It to <span className="gold-text italic">Believe It.</span>
            </h2>
            <div className="divider-gold mx-auto mb-5" />
            <p className="text-base text-slate dark:text-slate-2 max-w-lg mx-auto">
              Step inside Rahitalu Game Lounge — where every corner is designed
              with purpose and every detail is a statement.
            </p>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
          {photos.map((photo, i) => (
            <FadeIn key={photo.id} delay={i * 0.07}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280 }}
                onClick={() => setSelected(photo)}
                className={`${photo.span} relative rounded-2xl overflow-hidden cursor-pointer
                             border border-gold/10 hover:border-gold/40 h-full
                             hover:shadow-gold transition-all duration-300`}>
                <img src={photo.src} alt={photo.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                {/* Overlay */}
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-navy/50 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <Expand size={20} className="mx-auto mb-1.5 text-gold" />
                    <p className="text-[11px] font-semibold tracking-widest uppercase">{photo.label}</p>
                  </div>
                </motion.div>
                {/* Label strip */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent
                                p-3 z-[5]">
                  <p className="text-[10px] font-semibold text-white/80 tracking-wide">{photo.label}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-navy/85 backdrop-blur-md flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-gold/25 shadow-gold-lg">
                <img src={selected.src} alt={selected.label}
                  className="w-full h-auto max-h-[70vh] object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent px-6 py-5">
                  <p className="font-display text-lg font-bold text-ivory">{selected.label}</p>
                  <p className="text-xs text-slate-2 tracking-widest uppercase">Rahitalu Game Lounge</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-navy/80 backdrop-blur-sm
                             border border-gold/20 flex items-center justify-center text-ivory
                             hover:bg-gold/20 transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
