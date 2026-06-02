import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import TimelineBar from '../components/timeline/TimelineBar'
import DateSelector from '../components/timeline/DateSelector'
import LogList from '../components/timeline/LogList'
import LogEditor from '../components/timeline/LogEditor'
import LogReader from '../components/timeline/LogReader'
import PhotoGrid from '../components/timeline/PhotoGrid'
import PhotoViewer from '../components/timeline/PhotoViewer'
import {
  getAvailableDates, getLogsByDate, getPhotosByDate,
  createLog, updateLog, deleteLog,
  uploadPhoto, deletePhoto,
  type Log, type Photo,
} from '../lib/data'
import { isPlaying, toggle, subscribe } from '../lib/music'

type Theme = 'dark' | 'light'
const LAST_DATE_KEY = 'memories_last_date'
const THEME_KEY = 'memories_theme'

function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'light'
}

export default function TimelinePage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [playing, setPlaying] = useState(isPlaying)

  const [dates, setDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<Log | null>(null)
  const [readingLog, setReadingLog] = useState<Log | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null)

  const loadDates = useCallback(async () => {
    const d = await getAvailableDates()
    setDates(d)
    if (d.length > 0 && !selectedDate) {
      // Try restore last viewed date
      const last = localStorage.getItem(LAST_DATE_KEY)
      if (last && d.includes(last)) {
        setSelectedDate(last)
      } else {
        setSelectedDate(d[d.length - 1])
      }
    }
    setLoading(false)
  }, [selectedDate])

  useEffect(() => { loadDates() }, [])
  useEffect(() => subscribe(setPlaying), [])

  const loadContent = useCallback(async () => {
    if (!selectedDate) return
    const [logData, photoData] = await Promise.all([
      getLogsByDate(selectedDate), getPhotosByDate(selectedDate),
    ])
    setLogs(logData)
    setPhotos(photoData)
    // Remember
    localStorage.setItem(LAST_DATE_KEY, selectedDate)
  }, [selectedDate])

  useEffect(() => { loadContent() }, [loadContent])

  const handleDateChange = (date: string) => setSelectedDate(date)
  const handleAddLog = () => { setEditingLog(null); setEditorOpen(true) }
  const handleEditLog = (log: Log) => { setEditingLog(log); setEditorOpen(true) }

  const handleSaveLog = async (data: { title: string; content: string; log_date: string }) => {
    if (editingLog) await updateLog(editingLog.id, { title: data.title, content: data.content })
    else await createLog(data)
    setEditorOpen(false)
    setEditingLog(null)
    await loadDates()
    if (data.log_date !== selectedDate) setSelectedDate(data.log_date)
    else await loadContent()
  }

  const handleDeleteLog = async (id: string) => { await deleteLog(id); await loadDates(); await loadContent() }
  const handleUploadPhoto = async (file: File) => { await uploadPhoto(file, '', selectedDate); await loadDates(); await loadContent() }
  const handleDeletePhoto = async (photo: Photo) => { await deletePhoto(photo.id, photo.image_url); await loadDates(); await loadContent() }

  // Swipe Gesture
  let touchStartX = 0
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX
    const threshold = 80
    if (Math.abs(dx) < threshold) return
    const idx = dates.indexOf(selectedDate)
    // Swipe left = newer (index-1), swipe right = older (index+1)
    if (dx < -threshold && idx > 0) {
      handleDateChange(dates[idx - 1])
    } else if (dx > threshold && idx < dates.length - 1) {
      handleDateChange(dates[idx + 1])
    }
  }

  const isLight = theme === 'light'
  const bg = isLight ? 'bg-[var(--color-bg-warm)]' : 'bg-[var(--color-bg-dark)]'
  const text = isLight ? 'text-stone-700' : 'text-white/40'
  const textHover = isLight ? 'text-stone-900' : 'text-white/70'
  const border = isLight ? 'border-stone-200' : 'border-white/5'
  const btnBorder = isLight ? 'border-stone-300' : 'border-white/30'
  const btnText = isLight ? 'text-stone-500' : 'text-white/60'
  const btnHover = isLight ? 'hover:text-stone-900 hover:border-stone-500' : 'hover:text-white hover:border-white/60'

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${bg}`}>
      <p className={isLight ? 'text-stone-400 animate-pulse' : 'text-white/30 animate-pulse'}>加载中...</p>
    </div>
  )

  return (
    <div className={`min-h-screen ${bg} flex flex-col transition-colors`}>
      {/* Top Bar */}
      <div className={`flex items-center px-4 md:px-8 py-3 border-b ${border}`}>
        <button
          onClick={() => navigate('/home')}
          className={`${text} ${textHover} text-sm tracking-wider transition-colors cursor-pointer`}
        >
          ← 返回
        </button>
      </div>

      {/* Timeline Bar */}
      <TimelineBar eventDates={dates} selectedDate={selectedDate} onChange={handleDateChange} />

      {/* Date Selector + Prev/Next + Theme */}
      <div className="px-4 md:px-8 pb-3 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => {
            const idx = dates.indexOf(selectedDate)
            if (idx < dates.length - 1) handleDateChange(dates[idx + 1])
          }}
          disabled={dates.indexOf(selectedDate) >= dates.length - 1}
          className={`shrink-0 text-xs px-4 py-2 rounded-full border ${btnBorder}
                     ${btnText} ${btnHover}
                     disabled:opacity-20 disabled:cursor-default cursor-pointer transition-colors font-medium`}
        >
          ← 上一篇
        </button>

        <DateSelector dates={dates} selected={selectedDate} theme={theme} onChange={handleDateChange} />

        <button
          onClick={() => {
            const idx = dates.indexOf(selectedDate)
            if (idx > 0) handleDateChange(dates[idx - 1])
          }}
          disabled={dates.indexOf(selectedDate) <= 0}
          className={`shrink-0 text-xs px-4 py-2 rounded-full border ${btnBorder}
                     ${btnText} ${btnHover}
                     disabled:opacity-20 disabled:cursor-default cursor-pointer transition-colors font-medium`}
        >
          下一篇 →
        </button>

        <button
          onClick={toggle}
          className={`shrink-0 text-xs min-w-[32px] min-h-[32px] rounded-full border cursor-pointer transition-colors flex items-center justify-center leading-none ${
            playing
              ? 'border-[#c9a0b8]/60 text-[#c9a0b8]'
              : `${btnBorder} ${btnText} ${btnHover}`}`}
          title={playing ? '暂停' : '播放'}
        >
          {playing ? '⏸' : '♪'}
        </button>
        <button
          onClick={() => setTheme(t => { const n = t === 'dark' ? 'light' : 'dark'; localStorage.setItem(THEME_KEY, n); return n })}
          className={`shrink-0 text-xs px-3 py-2 rounded-full border ${btnBorder}
                     ${btnText} ${btnHover} cursor-pointer transition-colors`}
        >
          {isLight ? '🌙 暗色' : '☀️ 亮色'}
        </button>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 flex flex-col md:flex-row"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`flex-1 p-4 md:p-6 md:border-r ${border} min-h-0`}>
          <LogList
            logs={logs} theme={theme}
            onEdit={handleEditLog} onDelete={handleDeleteLog}
            onAdd={handleAddLog} onRead={setReadingLog}
          />
        </div>
        <div className="flex-1 p-4 md:p-6 min-h-0">
          <PhotoGrid
            photos={photos} theme={theme}
            onUpload={handleUploadPhoto} onDelete={handleDeletePhoto}
            onView={setViewingPhoto}
          />
        </div>
      </div>

      {editorOpen && (
        <LogEditor log={editingLog} defaultDate={selectedDate} onSave={handleSaveLog}
          onClose={() => { setEditorOpen(false); setEditingLog(null) }} />
      )}
      {readingLog && (
        <LogReader log={readingLog} theme={theme} onClose={() => setReadingLog(null)} />
      )}
      {viewingPhoto && (
        <PhotoViewer photo={viewingPhoto} onClose={() => setViewingPhoto(null)} />
      )}
    </div>
  )
}
