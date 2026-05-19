import { motion } from 'framer-motion'
import type { Log } from '../../lib/data'

interface LogReaderProps {
  log: Log
  theme: 'dark' | 'light'
  onClose: () => void
}

export default function LogReader({ log, theme, onClose }: LogReaderProps) {
  const light = theme === 'light'
  const bg = light ? 'bg-[var(--color-bg-warm)] border-stone-200' : 'bg-[var(--color-bg-dark)] border-white/10'
  const headerBorder = light ? 'border-stone-200' : 'border-white/5'
  const textColor = light ? 'text-stone-700' : 'text-white/70'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className={`w-full max-w-2xl max-h-full ${bg} rounded-xl border overflow-hidden flex flex-col`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${headerBorder}`}>
          <div>
            <h2 className="text-lg tracking-wider" style={{
              fontFamily: 'var(--font-artistic)',
              color: light ? '#b5495b' : 'var(--color-rose-gold)',
            }}>
              {log.title}
            </h2>
            <p className={`text-xs mt-0.5 ${light ? 'text-stone-400' : 'text-white/30'}`}>{log.log_date}</p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full border flex items-center justify-center
                       ${light ? 'text-stone-400 hover:text-stone-800 border-stone-300' : 'text-white/40 hover:text-white/80 border-white/10'}
                       transition-colors cursor-pointer`}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-black/10
          [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <div className={`${textColor} text-base leading-relaxed`}>
            {log.content.split(/\r?\n/).filter(line => line.trim()).map((line, i) => (
              <p key={i} className="whitespace-pre-wrap" style={{ textIndent: '2em', marginBottom: '0.25em' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
