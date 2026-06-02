import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { play } from '../../lib/music'
import letterText from '/three_years.txt?raw'

interface EnvelopeLetterProps {
  onClose: () => void
}

// Preload text content so it works regardless of platform SPA routing
const content = letterText

export default function EnvelopeLetter({ onClose }: EnvelopeLetterProps) {
  const [opened, setOpened] = useState(false)
  const [closing, setClosing] = useState(false)
  const para4Ref = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const musicTriggered = useRef(false)

  useEffect(() => {
    // Auto-open with slight delay for dramatic effect
    const t = setTimeout(() => setOpened(true), 600)
    return () => clearTimeout(t)
  }, [])

  // Trigger music when user scrolls to paragraph 4
  const handleScroll = () => {
    if (musicTriggered.current || !para4Ref.current || !scrollRef.current) return
    const container = scrollRef.current
    const paraTop = para4Ref.current.offsetTop
    const scrollBottom = container.scrollTop + container.clientHeight
    if (scrollBottom >= paraTop + 20) {
      musicTriggered.current = true
      play()
    }
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 900)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

        {/* Envelope + Letter container */}
        <div className="relative" style={{ perspective: '1500px' }}>
          {/* Envelope body */}
          <motion.div
            className="relative w-[380px] sm:w-[500px] bg-[#f5ead0] rounded-lg shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, y: 40 }}
            animate={{
              scale: opened && !closing ? 1 : 0.8,
              y: 0,
            }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          >
            {/* Envelope flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[180px] origin-top z-10"
              style={{
                background: 'linear-gradient(180deg, #e8d5b0 0%, #d4c098 100%)',
                clipPath: 'polygon(0 0, 50% 65%, 100% 0)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: opened ? -180 : 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            />

            {/* Seal */}
            <motion.div
              className="absolute top-[110px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full z-20 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, #c44569 0%, #a8324e 100%)',
                boxShadow: '0 2px 12px rgba(196,69,105,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white/80 text-lg">♥</span>
            </motion.div>

            {/* Letter paper */}
            <motion.div
              className="relative bg-[#fdfaf2] mx-6 mb-6 rounded-sm overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
              }}
              initial={{ height: 0, marginTop: 0 }}
              animate={{
                height: opened ? 'auto' : 0,
                marginTop: opened ? 80 : 0,
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
            >
              <div ref={scrollRef} onScroll={handleScroll} className="px-8 py-8 max-h-[55vh] overflow-y-auto
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-track]:bg-transparent">
                {content.split('\n').map((line, i) => (
                  <p key={i} ref={i === 5 ? para4Ref : undefined} className="text-base leading-9 text-stone-700 mb-0" style={{
                    fontFamily: "'Noto Serif SC', 'SimSun', serif",
                    textIndent: '2em',
                  }}>
                    {line || ' '}
                  </p>
                ))}
                {/* Signature */}
                <div className="mt-6 text-right">
                  <p className="text-xs text-stone-400 italic" style={{ fontFamily: 'var(--font-artistic)' }}>
                    — 2023.06.11 ~ forever
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Close button */}
          {opened && !closing && (
            <motion.button
              onClick={handleClose}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full
                         border border-white/20 text-white/70 hover:text-white hover:border-white/40
                         cursor-pointer transition-colors text-sm tracking-wider"
              style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              收好这封信 ✉
            </motion.button>
          )}
        </div>

        {/* Closing paper-fold animation */}
        {closing && (
          <motion.div
            className="fixed inset-0 z-60 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[80px] h-[100px] bg-[#fdfaf2] rounded-sm"
                style={{
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
                  rotate: i * 15 - 30,
                }}
                initial={{
                  opacity: 0.8,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  y: 200 + i * 30,
                  rotateX: 180,
                  scale: 0.3,
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.06,
                  ease: [0.6, 0, 1, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
