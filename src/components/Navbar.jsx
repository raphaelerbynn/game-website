import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'
import logoImg from '../assets/imgs/logo-rahitalu.jpg'

const navLinks = [
  { label: 'About',       to: 'about'       },
  { label: 'Experience',  to: 'experience'  },
  { label: 'Pricing',     to: 'pricing'     },
  { label: 'Tournament',  to: 'tournament'  },
  { label: 'Gallery',     to: 'gallery'     },
  { label: 'Contact',     to: 'contact'     },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { darkMode, setDarkMode, setBookingOpen } = useApp()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-navy/95 backdrop-blur-xl shadow-navy/10 shadow-lg border-b border-gold/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-main px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="hero" smooth duration={600} className="cursor-pointer">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Rahitalu Game Lounge" className="w-9 h-9 rounded-xl object-cover shadow-gold" />
            <div>
              <p className="font-display font-bold text-navy dark:text-ivory text-[15px] leading-tight tracking-wide">Rahitalu</p>
              <p className="text-[9px] text-gold font-semibold tracking-[0.2em] uppercase leading-none">Game Lounge</p>
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} smooth duration={600} offset={-72}
              className="text-sm font-medium text-navy/65 dark:text-ivory/65
                         hover:text-gold dark:hover:text-gold transition-colors duration-300 cursor-pointer tracking-wide"
              activeClass="!text-gold" spy>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center
                       text-gold hover:bg-gold/10 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn-gold text-sm px-5 py-2.5" onClick={() => setBookingOpen(true)}>
            Book a Session
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center text-gold"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(!open)}
            className="p-2 rounded-xl hover:bg-gold/10 transition-colors">
            {open ? <X size={22} className="text-navy dark:text-ivory" /> : <Menu size={22} className="text-navy dark:text-ivory" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}
            className="md:hidden bg-white/98 dark:bg-navy/98 backdrop-blur-xl border-t border-gold/10 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} smooth duration={600} offset={-72}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-navy/80 dark:text-ivory/80 hover:text-gold transition-colors cursor-pointer">
                  {l.label}
                </Link>
              ))}
              <button className="btn-gold w-full text-sm mt-2"
                onClick={() => { setOpen(false); setBookingOpen(true) }}>
                Book a Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
