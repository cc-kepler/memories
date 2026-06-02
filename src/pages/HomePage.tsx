import { useState, useMemo, useEffect, useCallback } from 'react'
import EnvelopePanel from '../components/home/EnvelopePanel'
import GlobePanel from '../components/home/GlobePanel'
import EnvelopeLetter from '../components/home/EnvelopeLetter'
import { isPlaying, toggle, subscribe } from '../lib/music'

type Theme = 'dark' | 'light'
const THEME_KEY = 'memories_theme'
const LETTER_READ_KEY = 'memories_letter_read'

function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'dark'
}

function getDaysTogether(): number {
  const start = new Date(2023, 5, 11)
  const today = new Date()
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [playing, setPlaying] = useState(isPlaying)
  const [letterContent, setLetterContent] = useState('')
  const [showLetter, setShowLetter] = useState(false)
  const days = useMemo(() => getDaysTogether(), [])

  // Fetch letter content
  useEffect(() => {
    fetch('/three_years.txt').then(r => r.text()).then(setLetterContent).catch(() => {})
  }, [])

  // Auto-show letter whenever coming from opening page
  useEffect(() => {
    if (!letterContent) return
    if (sessionStorage.getItem('from_opening') === '1') {
      sessionStorage.removeItem('from_opening')
      const t = setTimeout(() => setShowLetter(true), 500)
      return () => clearTimeout(t)
    }
  }, [letterContent])

  // Music — starts when scrolling to paragraph 4 in the letter
  useEffect(() => {
    return subscribe(setPlaying)
  }, [])

  const handleCloseLetter = useCallback(() => {
    localStorage.setItem(LETTER_READ_KEY, '1')
    setShowLetter(false)
  }, [])

  const isLight = theme === 'light'
  const bg = isLight ? 'bg-[var(--color-bg-warm)]' : 'bg-[var(--color-bg-dark)]'
  const border = isLight ? 'border-stone-200' : 'border-white/5'

  return (
    <div className={`min-h-screen ${bg} flex flex-col transition-colors`}>
      {/* Top Bar */}
      <div className={`flex items-center justify-center px-4 py-3 border-b ${border} relative`}>
        <span className="text-xl tracking-wider font-semibold"
          style={{
            color: isLight ? '#9b4d7e' : '#c9a0b8',
            fontFamily: 'var(--font-artistic)',
          }}>
          在一起 {days} 天
        </span>
        <div className="absolute right-4 flex items-center gap-2">
          {localStorage.getItem(LETTER_READ_KEY) && (
            <button
              onClick={() => setShowLetter(true)}
              className={`shrink-0 text-xs min-w-[32px] min-h-[32px] rounded-full border cursor-pointer transition-colors flex items-center justify-center leading-none ${
                isLight ? 'border-stone-400 text-stone-600 hover:text-stone-900 hover:border-stone-600'
                        : 'border-white/30 text-white/60 hover:text-white hover:border-white/50'}`}
              title="再看一遍信 ✉"
            >
              ✉
            </button>
          )}
          <button
            onClick={toggle}
            className={`shrink-0 text-xs min-w-[32px] min-h-[32px] rounded-full border cursor-pointer transition-colors flex items-center justify-center leading-none ${
              playing
                ? 'border-[#c9a0b8]/60 text-[#c9a0b8]'
                : isLight ? 'border-stone-400 text-stone-600 hover:text-stone-900 hover:border-stone-600'
                : 'border-white/30 text-white/60 hover:text-white hover:border-white/50'}`}
            title={playing ? '暂停' : '播放'}
          >
            {playing ? '⏸' : '♪'}
          </button>
          <button
            onClick={() => { const t: Theme = theme === 'dark' ? 'light' : 'dark'; setTheme(t); localStorage.setItem(THEME_KEY, t) }}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
              isLight ? 'border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-500'
                      : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'}`}
          >
            {isLight ? '🌙 暗色' : '☀️ 亮色'}
          </button>
        </div>
      </div>

      {/* Two panels */}
      <div className={`flex-1 flex flex-col md:flex-row ${bg}`}>
        <div className={`flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r ${border}`}>
          <EnvelopePanel />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <GlobePanel />
        </div>
      </div>

      {/* Letter envelope overlay */}
      {showLetter && letterContent && (
        <EnvelopeLetter content={letterContent} onClose={handleCloseLetter} />
      )}
    </div>
  )
}
