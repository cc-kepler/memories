import { useState, useEffect } from 'react'
import type { Log } from '../../lib/data'

interface LogEditorProps {
  log?: Log | null
  defaultDate: string
  onSave: (data: { title: string; content: string; log_date: string }) => void
  onClose: () => void
}

export default function LogEditor({ log, defaultDate, onSave, onClose }: LogEditorProps) {
  const [title, setTitle] = useState(log?.title || '')
  const [content, setContent] = useState(log?.content || '')
  const [logDate, setLogDate] = useState(log?.log_date || defaultDate)

  useEffect(() => {
    if (log) {
      setTitle(log.title)
      setContent(log.content)
      setLogDate(log.log_date)
    } else {
      setTitle('')
      setContent('')
      setLogDate(defaultDate)
    }
  }, [log, defaultDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !logDate) return
    onSave({ title: title.trim(), content: content.trim(), log_date: logDate })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg bg-[var(--color-bg-dark)] rounded-xl border border-white/10 p-6"
           style={{ maxHeight: '90vh', overflow: 'auto' }}>
        <h3 className="text-lg mb-4 tracking-wider"
          style={{ fontFamily: 'var(--font-artistic)', color: 'var(--color-rose-gold)' }}>
          {log ? '编辑日志' : '新增日志'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/40 text-sm mb-1">日期</label>
            <input
              type="date"
              value={logDate}
              onChange={e => setLogDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white
                         text-sm focus:outline-none focus:border-[var(--color-rose-gold)]/50"
            />
          </div>

          <div>
            <label className="block text-white/40 text-sm mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="日志标题"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white
                         text-sm focus:outline-none focus:border-[var(--color-rose-gold)]/50
                         placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="block text-white/40 text-sm mb-1">内容</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={8}
              placeholder="写点什么..."
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white
                         text-sm focus:outline-none focus:border-[var(--color-rose-gold)]/50
                         placeholder:text-white/20 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-white/40 hover:text-white/60 cursor-pointer transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm rounded-full border border-[var(--color-rose-gold)]/40
                         text-[var(--color-rose-gold)] hover:bg-[var(--color-rose-gold)]/10
                         cursor-pointer transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
