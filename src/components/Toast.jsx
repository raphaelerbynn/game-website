import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toastMsg, setToastMsg } = useApp()

  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-full px-4"
        >
          <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-gold-lg border
            ${toastMsg.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
              : 'bg-white dark:bg-navy-2 border-gold/30'
            }`}>

            {toastMsg.type === 'error'
              ? <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              : <CheckCircle size={20} className="text-gold flex-shrink-0 mt-0.5" />
            }

            <p className={`text-sm flex-1 leading-snug font-medium
              ${toastMsg.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-navy dark:text-ivory'}`}>
              {toastMsg.msg}
            </p>

            <button onClick={() => setToastMsg(null)}
              className="text-slate hover:text-navy dark:hover:text-ivory transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
