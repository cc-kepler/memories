import { useRef } from 'react'
import type { Photo } from '../../lib/data'

interface PhotoGridProps {
  photos: Photo[]
  theme: 'dark' | 'light'
  onUpload: (file: File) => void
  onDelete: (photo: Photo) => void
  onView: (photo: Photo) => void
}

export default function PhotoGrid({ photos, theme, onUpload, onDelete, onView }: PhotoGridProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const light = theme === 'light'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        compressImage(file).then(compressed => onUpload(compressed))
      } else {
        onUpload(file)
      }
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          const maxDim = 1200
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = (height / width) * maxDim; width = maxDim }
            else { width = (width / height) * maxDim; height = maxDim }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            else resolve(file)
          }, 'image/jpeg', 0.8)
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const titleColor = light ? 'text-rose-600' : 'text-[var(--color-rose-gold)]'
  const emptyColor = light ? 'text-stone-400' : 'text-white/40'
  const addBtn = light
    ? 'border-rose-400 text-rose-600 hover:bg-rose-50'
    : 'border-white/40 text-white/60 hover:text-white hover:border-white/60'

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm tracking-wider ${titleColor}`}>照片</h3>
        <button
          onClick={() => inputRef.current?.click()}
          className={`text-xs px-3 py-1 rounded-full border ${addBtn} transition-colors cursor-pointer`}
        >
          + 上传照片
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
               onChange={handleFileChange} className="hidden" />
      </div>

      {photos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className={`${emptyColor} text-sm`}>暂无照片</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-black/10
          [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <div className="flex flex-col gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="group relative w-full rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                   onClick={() => onView(photo)}>
                <img src={photo.image_url} alt={photo.photo_date}
                     className="w-full h-auto" loading="lazy" />
                <button
                  onClick={() => { if (confirm('确定删除这张照片吗？')) onDelete(photo) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50
                             flex items-center justify-center opacity-0 group-hover:opacity-100
                             transition-opacity cursor-pointer"
                  title="删除照片"
                >
                  <span className="text-white text-sm">✕</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
