import { motion } from 'framer-motion'
import type { Photo } from '../../lib/data'

interface PhotoViewerProps {
  photo: Photo
  onClose: () => void
}

export default function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className="max-w-full max-h-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <img
          src={photo.image_url}
          alt={photo.photo_date}
          className="max-w-full max-h-[85vh] rounded-lg object-contain"
        />
        <p className="text-white/40 text-xs text-center mt-2">{photo.photo_date}</p>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20
                   flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20
                   transition-colors cursor-pointer"
      >
        ✕
      </button>
    </motion.div>
  )
}
