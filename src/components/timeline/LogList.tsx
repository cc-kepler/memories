import type { Log } from '../../lib/data'

interface LogListProps {
  logs: Log[]
  theme: 'dark' | 'light'
  onEdit: (log: Log) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onRead: (log: Log) => void
}

export default function LogList({ logs, theme, onEdit, onDelete, onAdd, onRead }: LogListProps) {
  const light = theme === 'light'
  const cardBg = light ? 'bg-stone-100 border-stone-200 hover:border-stone-400' : 'bg-white/[0.03] border-white/5 hover:border-white/10'
  const titleColor = light ? 'text-stone-800' : 'text-white/80'
  const contentColor = light ? 'text-stone-600' : 'text-white/50'
  const emptyColor = light ? 'text-stone-300' : 'text-white/20'
  const accent = light ? 'text-rose-600' : 'text-[var(--color-rose-gold)]'
  const btnColor = light ? 'text-stone-400 hover:text-stone-700' : 'text-white/50 hover:text-white/80'
  const btnDelete = light ? 'text-stone-400 hover:text-red-500' : 'text-white/40 hover:text-red-400'
  const addBtn = light
    ? 'border-rose-400 text-rose-600 hover:bg-rose-50'
    : 'border-white/40 text-white/60 hover:text-white hover:border-white/60'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm tracking-wider ${accent}`}>日志</h3>
        <button
          onClick={onAdd}
          className={`text-xs px-3 py-1 rounded-full border ${addBtn} transition-colors cursor-pointer`}
        >
          + 写日志
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className={`${emptyColor} text-sm`}>暂无日志</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-black/10
          [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {logs.map(log => (
            <div
              key={log.id}
              onClick={() => onRead(log)}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${cardBg}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className={`${titleColor} text-base font-medium leading-relaxed`}>
                  {log.title}
                </h4>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(log) }}
                    className={`text-xs ${btnColor} transition-colors cursor-pointer`}
                  >
                    编辑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定删除这条日志吗？')) onDelete(log.id)
                    }}
                    className={`text-xs ${btnDelete} transition-colors cursor-pointer`}
                  >
                    删除
                  </button>
                </div>
              </div>
              <div className={`${contentColor} text-base leading-relaxed`}>
                {log.content.split(/\r?\n/).filter(line => line.trim()).map((line, i) => (
                  <p key={i} className="whitespace-pre-wrap" style={{ textIndent: '2em', marginBottom: '0.25em' }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
