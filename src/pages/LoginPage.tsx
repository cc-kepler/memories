import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, signUp, configured } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const result = isRegister
      ? await signUp(email, password)
      : await signIn(email, password)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else if (isRegister) {
      setError('注册成功！请登录。')
      setIsRegister(false)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-dark)] px-6">
      <h1
        className="text-3xl md:text-4xl mb-2 tracking-wider"
        style={{
          fontFamily: 'var(--font-artistic)',
          background: 'linear-gradient(135deg, #c9a87c, #e8c9a0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Memories
      </h1>
      <p className="text-white/40 text-sm mb-10 tracking-wider">2023.06.11 — 2026.06.11</p>

      {!configured && (
        <div className="w-full max-w-sm mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-[var(--color-rose-gold)] text-sm">网站尚未配置数据库</p>
          <p className="text-white/30 text-xs mt-1">请先创建 Supabase 项目并配置 .env 文件</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white
                     placeholder:text-white/30 focus:outline-none focus:border-[var(--color-rose-gold)]/50
                     transition-colors"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white
                     placeholder:text-white/30 focus:outline-none focus:border-[var(--color-rose-gold)]/50
                     transition-colors"
        />

        {error && (
          <p className={`text-sm text-center ${error.includes('成功') ? 'text-green-400' : 'text-red-400'}`}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-full border border-[var(--color-rose-gold)]/40
                     text-[var(--color-rose-gold)] tracking-[0.15em] uppercase text-sm
                     hover:bg-[var(--color-rose-gold)]/10 transition-colors
                     disabled:opacity-50 cursor-pointer"
          style={{ fontFamily: 'var(--font-artistic)' }}
        >
          {submitting ? '...' : isRegister ? '注册' : '登录'}
        </button>
      </form>

      <button
        onClick={() => { setIsRegister(!isRegister); setError('') }}
        className="mt-6 text-white/30 text-sm hover:text-white/60 transition-colors cursor-pointer"
      >
        {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
      </button>
    </div>
  )
}
