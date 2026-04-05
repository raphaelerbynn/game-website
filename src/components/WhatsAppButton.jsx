import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { WA_NUMBER } from '../config'

const WA_MSG = encodeURIComponent("Hi! I'd like to book a PS5 session at Rahitalu Game Lounge.")

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="bg-white dark:bg-navy-2 rounded-2xl shadow-gold-lg border border-gold/20 p-4 w-64">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy dark:text-ivory leading-none">Rahitalu Lounge</p>
                <p className="text-[10px] text-green-500 font-semibold">● Online now</p>
              </div>
            </div>
            <p className="text-xs text-slate dark:text-slate-2 leading-relaxed mb-3">
              Chat with us on WhatsApp — book a session, ask about pricing, or just say hi!
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-bold py-2.5 px-4 rounded-xl
                         bg-green-500 hover:bg-green-600 text-white transition-colors duration-200">
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white
                   flex items-center justify-center shadow-[0_8px_32px_rgba(34,197,94,0.45)]
                   transition-colors duration-200 relative">
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle size={22} />
              </motion.div>
          }
        </AnimatePresence>
        {/* Ping dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold border-2 border-white
                           animate-pulse" />
        )}
      </motion.button>
    </div>
  )
}
