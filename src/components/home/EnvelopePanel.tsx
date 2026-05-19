import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGE_COUNT = 3
const FLIP_DELAY = 150 // ms between each page flip

export default function EnvelopePanel() {
  const navigate = useNavigate()
  const [flipped, setFlipped] = useState<number>(-1) // -1=none, 0=cover, 1..5=pages

  const handleClick = () => {
    if (flipped >= 0) return
    // Flip cover + pages sequentially
    for (let i = 0; i <= PAGE_COUNT; i++) {
      setTimeout(() => {
        setFlipped(i)
        if (i === PAGE_COUNT) {
          setTimeout(() => navigate('/timeline'), 400)
        }
      }, i * FLIP_DELAY + 100)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[50vh] cursor-pointer group"
         onClick={handleClick} style={{ perspective: '1200px' }}>

      <h2 className="text-5xl md:text-7xl mb-6 tracking-[0.15em] select-none" style={{
        fontFamily: 'var(--font-artistic)',
        background: 'linear-gradient(135deg, #c9a87c 0%, #e8c9a0 50%, #d4a5a5 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 14px rgba(201, 168, 124, 0.4))',
      }}>The Time</h2>

      {/* Notebook */}
      <div className="relative w-48 h-60 md:w-56 md:h-72" style={{ transformStyle: 'preserve-3d' }}>

        {/* Back cover - always at bottom, revealed when all pages flip */}
        <div className="absolute inset-0 rounded-md overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transform: 'translateZ(-1px)' }}>
          <img src="/notebook_bottom.jpg" alt="" className="w-full h-full object-cover" />
        </div>

        {/* Middle pages (bottom to top: page 5 → page 1) */}
        {Array.from({ length: PAGE_COUNT }).map((_, idx) => {
          const pageNum = PAGE_COUNT - idx
          const isFlipped = flipped >= pageNum
          // Slightly different tint per page for visual depth
          const hues = ['#fefdf9', '#fcf9f2', '#faf5ec']
          return (
            <div key={idx}
              className="absolute top-[2px] left-[3px] right-[2px] bottom-[2px] rounded-r-sm origin-left"
              style={{
                background: hues[idx],
                transformStyle: 'preserve-3d',
                transition: isFlipped ? 'transform 0.35s ease-in' : 'none',
                transform: isFlipped ? 'rotateY(-175deg)' : 'rotateY(0deg)',
                zIndex: isFlipped ? 0 : pageNum + 1,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)',
              }}
            >
              {/* Front face: paper */}
              <div className="absolute inset-0 rounded-r-sm"
                style={{ background: hues[idx], backfaceVisibility: 'hidden' }} />
              {/* Back face */}
              <div className="absolute inset-0 rounded-l-sm"
                style={{
                  background: '#ece4d5',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                }} />
            </div>
          )
        })}

        {/* Front cover - topmost */}
        <div className="absolute inset-0 rounded-md origin-left"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: flipped >= 0 ? '2px 0 16px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.35)',
            transition: flipped >= 0
              ? 'transform 0.4s ease-in, box-shadow 0.4s ease'
              : 'none',
            transform: flipped >= 0 ? 'rotateY(-175deg)' : 'rotateY(0deg)',
            zIndex: flipped >= 0 ? 0 : 10,
          }}
        >
          {/* Front face: cover image */}
          <div className="absolute inset-0 rounded-md overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}>
            <img src="/notebook_cover.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          {/* Back face: inside cover */}
          <div className="absolute inset-0 rounded-r-md"
            style={{
              background: '#c9b896',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }} />
        </div>
      </div>

      <p className="mt-8 text-sm tracking-[0.2em] text-[var(--color-rose-gold)]/70 group-hover:text-[var(--color-rose-gold)] transition-colors select-none">
        点此进入
      </p>
    </div>
  )
}
