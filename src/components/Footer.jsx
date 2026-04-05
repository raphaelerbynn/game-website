import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { Heart, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import logoImg from '../assets/imgs/logo-rahitalu.jpg'

const links = [
  { label: 'About',      to: 'about'      },
  { label: 'Experience', to: 'experience' },
  { label: 'Pricing',    to: 'pricing'    },
  { label: 'Tournament', to: 'tournament' },
  { label: 'Gallery',    to: 'gallery'    },
  { label: 'Contact',    to: 'contact'    },
]

const socials = [
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  { icon: Instagram,     href: '#', label: 'Instagram' },
  { icon: Twitter,       href: '#', label: 'Twitter' },
  { icon: Facebook,      href: '#', label: 'Facebook' },
]

export default function Footer() {
  const { setBookingOpen } = useApp()

  return (
    <footer className="bg-navy text-ivory">
      {/* Gold top line */}
      <div className="h-px w-full bg-gold-gradient opacity-30" />

      <div className="container-main px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="hero" smooth duration={600} className="cursor-pointer inline-block mb-4">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Rahitalu Game Lounge" className="w-10 h-10 rounded-xl object-cover shadow-gold" />
                <div>
                  <p className="font-display font-bold text-ivory text-base leading-tight">Rahitalu</p>
                  <p className="text-[9px] text-gold font-semibold tracking-[0.2em] uppercase leading-none">Game Lounge</p>
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-2 leading-relaxed mb-5 max-w-xs">
              Cape Coast's most premium PS5 gaming experience.
              <br />
              <span className="text-gold italic font-display">Elevate Your Game.</span>
            </p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center
                             text-slate-2 hover:text-gold hover:border-gold/50 transition-all duration-300">
                  <s.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {links.map(link => (
                <Link key={link.to} to={link.to} smooth duration={600} offset={-72}
                  className="text-sm text-slate-2 hover:text-gold transition-colors duration-300 cursor-pointer w-fit">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA / Hours */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold mb-5">Opening Hours</p>
            <p className="text-sm text-slate-2 mb-1">Monday – Sunday</p>
            <p className="font-display text-2xl font-bold text-ivory mb-1">10AM – 11PM</p>
              <p className="text-xs text-slate-2 mb-6">Science Roundabout, UCC</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setBookingOpen(true)}
              className="btn-gold text-sm px-6 py-2.5">
              Book a Session
            </motion.button>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-7" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Rahitalu Game Lounge. All rights reserved.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            Made by Mountain
          </p>
        </div>
      </div>
    </footer>
  )
}
