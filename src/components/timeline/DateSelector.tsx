interface DateSelectorProps {
  dates: string[]
  selected: string
  theme: 'dark' | 'light'
  onChange: (date: string) => void
}

export default function DateSelector({ dates, selected, theme, onChange }: DateSelectorProps) {
  const light = theme === 'light'

  if (dates.length === 0) {
    return (
      <p className={`text-sm text-center py-4 ${light ? 'text-stone-400' : 'text-white/30'}`}>
        还没有任何记录
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <label className={`text-sm tracking-wider whitespace-nowrap ${light ? 'text-stone-500' : 'text-white/40'}`}>
        选择日期
      </label>
      <select
        value={selected}
        onChange={e => onChange(e.target.value)}
        className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:border-[var(--color-rose-gold)]/50 cursor-pointer appearance-none ${
          light
            ? 'bg-white border-stone-300 text-stone-700'
            : 'bg-white/5 border-white/10 text-white'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23c9a87c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        {dates.map(d => (
          <option key={d} value={d} className={light ? 'bg-white text-stone-700' : 'bg-[var(--color-bg-dark)] text-white'}>
            {d}
          </option>
        ))}
      </select>
    </div>
  )
}
