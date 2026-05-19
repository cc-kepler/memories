import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlobeScene from './GlobeScene'

function FloatingCities({ onComplete }: { onComplete: () => void }) {
  const cities = ['惠州', '珠海', '汕头', '潮州', '杭州', '福州', '深圳', '绍兴', '南京', '上海', '芜湖', '滁州', '莆田', '马鞍山', '常州']

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      {cities.map((city, i) => (
        <motion.div
          key={city}
          className="absolute text-sm tracking-wider whitespace-nowrap"
          style={{
            left: '50%', top: '50%',
            color: ['#e88d8d', '#e8c9a0', '#d4a5a5', '#f0a0b0', '#c9a87c'][i % 5],
            fontFamily: 'var(--font-artistic)',
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0], scale: [0.3, 1.1, 0.5],
            x: (Math.random() - 0.5) * 220, y: -120 - Math.random() * 160,
          }}
          transition={{
            duration: 1.2, delay: i * 0.06, ease: 'easeOut',
            onComplete: i === cities.length - 1 ? onComplete : undefined,
          }}
        >
          {city}
        </motion.div>
      ))}
    </div>
  )
}

export default function GlobePanel() {
  const navigate = useNavigate()
  const [showPins, setShowPins] = useState(false)

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full min-h-[50vh] cursor-pointer group"
      onClick={() => { if (!showPins) setShowPins(true) }}
    >
      <h2
        className="text-5xl md:text-7xl mb-6 tracking-[0.15em] select-none"
        style={{
          fontFamily: 'var(--font-artistic)',
          background: 'linear-gradient(135deg, #c9a87c 0%, #e8c9a0 50%, #d4a5a5 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 14px rgba(201, 168, 124, 0.4))',
        }}
      >
        The Map
      </h2>

      <div className="w-56 h-56 md:w-72 md:h-72">
        <GlobeScene />
      </div>

      <p className="mt-8 text-sm tracking-[0.2em] text-[var(--color-rose-gold)]/70 group-hover:text-[var(--color-rose-gold)] transition-colors select-none">
        点此进入
      </p>

      {showPins && <FloatingCities onComplete={() => navigate('/map')} />}
    </div>
  )
}
