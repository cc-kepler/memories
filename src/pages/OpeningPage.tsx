import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OpeningPage() {
  const [progress, setProgress] = useState(0)
  const [showEnter, setShowEnter] = useState(false)
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const duration = 2500
    const interval = 30
    const step = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => setShowEnter(true), 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const handleEnter = () => {
    if (loading) return
    if (user) {
      navigate('/home', { state: { fromOpening: true } })
    } else {
      navigate('/login')
    }
  }

  // 未配置 Supabase 时仍然可以查看开屏动画
  // 点击 Enter 会跳转到登录页并显示配置提示

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 bg-[var(--color-bg-dark)]">
      {/* 背景图片层 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg.jpg)' }}
      />
      {/* 暗色遮罩，保证文字可读 */}
      <div className="absolute inset-0 bg-[var(--color-bg-dark)]/70" />

      {/* 内容（置于遮罩之上） */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="text-4xl md:text-5xl mb-8 tracking-wider"
          style={{
            fontFamily: 'var(--font-artistic)',
            background: 'linear-gradient(135deg, #c9a87c, #e8c9a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loading Memories
        </h1>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 h-1 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #e88d8d, #d4a5a5)',
            }}
          />
        </div>
        <p className="mt-2 text-sm text-white/40">{Math.round(progress)}%</p>

        {/* Enter Button */}
        {showEnter && (
          <button
            onClick={handleEnter}
            className="mt-10 px-10 py-3 text-lg tracking-[0.2em] uppercase rounded-full
                       border border-[var(--color-rose-gold)]/40
                       text-[var(--color-rose-gold)]
                       animate-breath animate-fade-in
                       hover:bg-[var(--color-rose-gold)]/10 transition-colors
                       cursor-pointer"
            style={{ fontFamily: 'var(--font-artistic)' }}
          >
            Enter
          </button>
        )}

        <p className="mt-16 text-base md:text-lg text-white/30 tracking-[0.3em]">
          2023.06.11 — 2026.06.11
        </p>
      </div>
    </div>
  )
}
