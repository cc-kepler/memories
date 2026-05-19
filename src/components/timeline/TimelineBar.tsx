interface TimelineBarProps {
  eventDates: string[]
  selectedDate: string
  onChange: (date: string) => void
}

export default function TimelineBar({ eventDates, selectedDate, onChange }: TimelineBarProps) {
  // dates are sorted descending (newest first), reverse for display (oldest → newest)
  const chronological = [...eventDates].reverse()

  const selIdx = chronological.indexOf(selectedDate)
  const halfWindow = 4
  const windowStart = Math.max(0, selIdx - halfWindow)
  const windowEnd = Math.min(chronological.length - 1, selIdx + halfWindow)
  const nearbyDates = chronological.slice(windowStart, windowEnd + 1)

  const hasEarlier = windowStart > 0
  const hasLater = windowEnd < chronological.length - 1

  const goEarlier = () => {
    if (hasEarlier) onChange(chronological[windowStart - 1])
  }

  const goLater = () => {
    if (hasLater) onChange(chronological[windowEnd + 1])
  }

  return (
    <div className="w-full px-4 md:px-12 py-4">
      <div className="flex items-center justify-between gap-2">
        {/* Left ellipsis */}
        <button
          onClick={goEarlier}
          disabled={!hasEarlier}
          className={`shrink-0 text-sm px-2 rounded transition-colors cursor-pointer
            ${hasEarlier ? 'text-white/25 hover:text-white/50' : 'text-white/5 cursor-default'}`}
        >
          ···
        </button>

        {/* Dots - evenly spaced */}
        <div className="flex-1 flex items-center justify-around">
          {nearbyDates.map(date => {
            const isSelected = date === selectedDate
            return (
              <button
                key={date}
                onClick={() => onChange(date)}
                className="relative flex flex-col items-center cursor-pointer group"
                title={date}
              >
                <div
                  className={`rounded-full transition-all ${
                    isSelected
                      ? 'w-3.5 h-3.5 bg-[var(--color-warm-pink)] shadow-[0_0_12px_rgba(232,141,141,0.7)]'
                      : 'w-2 h-2 bg-[var(--color-rose-gold)]/30 group-hover:bg-[var(--color-rose-gold)]/60 group-hover:w-2.5 group-hover:h-2.5'
                  }`}
                />
                {isSelected && (
                  <span className="absolute top-4 text-[10px] text-[var(--color-warm-pink)] whitespace-nowrap">
                    {date}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right ellipsis */}
        <button
          onClick={goLater}
          disabled={!hasLater}
          className={`shrink-0 text-sm px-2 rounded transition-colors cursor-pointer
            ${hasLater ? 'text-white/25 hover:text-white/50' : 'text-white/5 cursor-default'}`}
        >
          ···
        </button>
      </div>

      {/* Start/End labels */}
      <div className="flex justify-between mt-2 px-2">
        <span className="text-[10px] text-white/15 tracking-wider">2023.06.11</span>
        <span className="text-[10px] text-white/15 tracking-wider">2026.06.11</span>
      </div>
    </div>
  )
}
