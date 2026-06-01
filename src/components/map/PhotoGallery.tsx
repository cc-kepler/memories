import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import type { Photo } from '../../lib/data'

interface PhotoGalleryProps {
  city: string
  photos: Photo[]
  theme?: 'dark' | 'light'
  onUpload: (file: File, city: string, category: string) => void
  onDelete: (photo: Photo) => void
  onClose: () => void
}

export default function PhotoGallery({ city, photos, theme = 'dark', onUpload, onDelete, onClose }: PhotoGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [viewingIdx, setViewingIdx] = useState(-1)
  const [catInput, setCatInput] = useState('')
  const light = theme === 'light'

  // Group photos by category
  const grouped = useMemo(() => {
    const map = new Map<string, Photo[]>()
    photos.forEach(p => {
      const cat = p.category || '未分类'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(p)
    })
    return Array.from(map.entries())
  }, [photos])

  // Flat list for prev/next navigation
  const flatPhotos = useMemo(() => {
    const flat: Photo[] = []
    grouped.forEach(([, catPhotos]) => { catPhotos.forEach(p => flat.push(p)) })
    return flat
  }, [grouped])

  const viewing = viewingIdx >= 0 ? flatPhotos[viewingIdx] : null

  // Keyboard navigation
  useEffect(() => {
    if (viewingIdx < 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && viewingIdx > 0) setViewingIdx(viewingIdx - 1)
      if (e.key === 'ArrowRight' && viewingIdx < flatPhotos.length - 1) setViewingIdx(viewingIdx + 1)
      if (e.key === 'Escape') setViewingIdx(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewingIdx, flatPhotos.length])

  // Existing categories for datalist
  const categories = useMemo(() => {
    const cats = new Set<string>()
    photos.forEach(p => { if (p.category) cats.add(p.category) })
    return Array.from(cats)
  }, [photos])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file, city, catInput.trim())
    if (inputRef.current) inputRef.current.value = ''
    setCatInput('')
  }

  const titleColor = light ? 'text-rose-600' : 'text-[var(--color-coral-active)]'
  const uploadBtn = light
    ? 'border-rose-400 text-rose-500 hover:text-rose-700 hover:border-rose-500'
    : 'border-[var(--color-coral-active)]/40 text-[var(--color-coral-active)]/70 hover:text-[var(--color-coral-active)] hover:border-[var(--color-coral-active)]/60'
  const closeBtn = light
    ? 'border-stone-300 text-stone-400 hover:text-stone-700'
    : 'border-white/10 text-white/30 hover:text-white/60'
  const emptyTitle = light ? 'text-stone-400' : 'text-white/40'
  const emptySub = light ? 'text-stone-300' : 'text-white/25'
  const inputStyle = light
    ? 'border-stone-300 text-stone-600 bg-white placeholder:text-stone-300'
    : 'border-white/10 text-white/60 bg-white/5 placeholder:text-white/20'
  const navBtn = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 cursor-pointer transition-colors'

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm tracking-wider ${titleColor}`}>
          📍 {city}
          {photos.length > 0 && (
            <span className={light ? 'text-stone-400 text-xs ml-2' : 'text-white/30 text-xs ml-2'}>
              · {photos.length} 张照片 · {grouped.length} 个分类
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className={`text-xs px-3 py-1 rounded-full border ${closeBtn} transition-colors cursor-pointer`}
          >
            收起
          </button>
        </div>
      </div>

      {/* Upload area */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={catInput}
          onChange={(e) => setCatInput(e.target.value)}
          placeholder="分类名称（如：第一天）"
          list="category-list"
          className={`text-xs px-3 py-1.5 rounded-full border ${inputStyle} outline-none w-40`}
        />
        <datalist id="category-list">
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
        <button
          onClick={() => inputRef.current?.click()}
          className={`text-xs px-3 py-1 rounded-full border ${uploadBtn} transition-colors cursor-pointer font-medium whitespace-nowrap`}
        >
          + 上传
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
               onChange={handleFile} className="hidden" />
      </div>

      {/* Photos by category */}
      {photos.length === 0 ? (
        <div className="py-10 text-center">
          <p className={`${emptyTitle} text-sm`}>还没有照片</p>
          <p className={`${emptySub} text-xs mt-1`}>上传一张照片来激活这座城市</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(([cat, catPhotos]) => (
            <div key={cat}>
              <div className={`flex items-center gap-2 mb-2 text-sm font-medium ${light ? 'text-stone-600' : 'text-white/60'}`}>
                <span>📁 {cat}</span>
                <span className={light ? 'text-stone-400 text-xs' : 'text-white/30 text-xs'}>· {catPhotos.length} 张</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {catPhotos.map(photo => {
                  const idx = flatPhotos.indexOf(photo)
                  return (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                      onClick={() => setViewingIdx(idx)}
                    >
                      <img src={photo.image_url} alt={photo.category || city}
                           className="w-full h-full object-cover" loading="lazy" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('确定删除这张照片吗？')) onDelete(photo)
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50
                                   flex items-center justify-center opacity-0 group-hover:opacity-100
                                   transition-opacity cursor-pointer"
                        title="删除"
                      >
                        <span className="text-white text-xs">✕</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Viewer with prev/next */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={e => { if (e.target === e.currentTarget) setViewingIdx(-1) }}
        >
          {/* Close button */}
          <button
            onClick={() => setViewingIdx(-1)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20
                       flex items-center justify-center text-white/60 hover:text-white cursor-pointer z-10"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/50 text-sm">
            {viewingIdx + 1} / {flatPhotos.length}
          </div>

          {/* Prev button */}
          {viewingIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setViewingIdx(viewingIdx - 1) }}
              className={`${navBtn} left-6`}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <img src={viewing.image_url} alt="preview"
               className="max-w-full max-h-[85vh] object-contain rounded-lg" />

          {/* Next button */}
          {viewingIdx < flatPhotos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setViewingIdx(viewingIdx + 1) }}
              className={`${navBtn} right-6`}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  )
}
