import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Clock, Mail, MessageCircle, Instagram, Twitter, Facebook } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { WA_NUMBER } from '../config'

const info = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Science Roundabout, UCC',
    sub: 'Cape Coast, Ghana',
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '0557 810 714 / 0548 721 544',
    sub: 'Call or WhatsApp us anytime',
  },
  {
    icon: Clock,
    label: 'Opening Hours',
    value: 'Mon – Sun: 10:00 AM – 11:00 PM',
    sub: 'Open 7 days a week',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'rahitalu.arena@gmail.com',
    sub: 'Send us an email anytime',
  },
]

const socials = [
  { icon: MessageCircle, label: 'WhatsApp',  href: '#', cls: 'hover:bg-green-500 hover:border-green-500 hover:text-white' },
  { icon: Instagram,     label: 'Instagram', href: '#', cls: 'hover:bg-pink-500 hover:border-pink-500 hover:text-white'   },
  { icon: Twitter,       label: 'Twitter',   href: '#', cls: 'hover:bg-sky-500 hover:border-sky-500 hover:text-white'     },
  { icon: Facebook,      label: 'Facebook',  href: '#', cls: 'hover:bg-blue-600 hover:border-blue-600 hover:text-white'   },
]

const inputCls = `w-full px-4 py-3 rounded-xl bg-ivory-2 dark:bg-navy-2 border border-gold/20
  text-sm text-navy dark:text-ivory placeholder-slate/50
  focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/10 transition-all duration-200`

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

export default function Contact() {
  const { showToast } = useApp()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) {
      showToast('Please fill in your name and message.', 'error')
      return
    }
    const text = encodeURIComponent(
      `Hello Rahitalu Game Lounge!\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone || 'Not provided'}\n\n` +
      `Message:\n${form.message}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
    showToast(`Opening WhatsApp — your message is ready to send!`, 'success')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <section id="contact" className="section-pad section-light dark:section-light">
      <div className="container-main">

        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Find Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-ivory mb-5">
              Come & <span className="gold-text italic">Play With Us.</span>
            </h2>
            <div className="divider-gold mx-auto mb-5" />
            <p className="text-base text-slate dark:text-slate-2 max-w-lg mx-auto">
              We're right on campus. Come in, pick a station, and let's get gaming.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">

          {/* Info Cards */}
          <div className="flex flex-col gap-4">
            {info.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div className="card-glass p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate dark:text-slate-2 mb-1">
                      {item.label}
                    </p>
                    <p className="font-semibold text-navy dark:text-ivory text-sm mb-0.5">{item.value}</p>
                    <p className="text-xs text-slate dark:text-slate-2">{item.sub}</p>
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* Socials */}
            <FadeIn delay={0.3}>
              <div className="card-glass p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate dark:text-slate-2 mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} aria-label={s.label}
                      className={`w-10 h-10 rounded-xl border border-gold/20 flex items-center justify-center
                                  text-slate dark:text-slate-2 transition-all duration-300 ${s.cls}`}>
                      <s.icon size={18} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <FadeIn delay={0.15}>
            <div className="card-glass p-7">
              <h3 className="font-display text-xl font-bold text-navy dark:text-ivory mb-1">Send Us a Message</h3>
              <p className="text-sm text-slate dark:text-slate-2 mb-6">
                Got a question or want to book for a group? Reach out — we respond fast.
              </p>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate dark:text-slate-2 tracking-wide block mb-1.5">
                      Your Name *
                    </label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="e.g. Kwame" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate dark:text-slate-2 tracking-wide block mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+233 ..." className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate dark:text-slate-2 tracking-wide block mb-1.5">
                    Message *
                  </label>
                  <textarea rows={4} value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="Tell us what you need — booking, group event, enquiry..."
                    className={`${inputCls} resize-none`} />
                </div>

                <motion.button type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold w-full text-sm py-3 mt-1">
                  Send via WhatsApp
                </motion.button>
              </form>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
