import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ChinaMap from '../components/map/ChinaMap'
import PhotoGallery from '../components/map/PhotoGallery'
import { supabase } from '../lib/supabase'
import { uploadPhoto, deletePhoto, type Photo } from '../lib/data'

type Theme = 'dark' | 'light'
const THEME_KEY = 'memories_theme'

function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'dark'
}

export default function MapPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [activeCities, setActiveCities] = useState<Set<string>>(new Set())
  const [cityPhotos, setCityPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const loadActiveCities = useCallback(async () => {
    const { data } = await supabase.from('photos').select('city').neq('city', '')
    const active = new Set<string>()
    data?.forEach(p => { if (p.city) active.add(p.city) })
    setActiveCities(active)
    setLoading(false)
  }, [])

  useEffect(() => { loadActiveCities() }, [])

  const loadCityPhotos = useCallback(async (city: string) => {
    const { data } = await supabase
      .from('photos').select('*').eq('city', city).neq('city', '')
      .order('photo_date', { ascending: false })
    setCityPhotos(data || [])
  }, [])

  const handleSelect = (city: string) => {
    if (!city) { setSelectedCity(null); setCityPhotos([]); return }
    setSelectedCity(city)
    loadCityPhotos(city)
  }

  const handleProvinceSelect = (prov: string | null) => {
    setSelectedProvince(prov)
    setSelectedCity(null)
    setCityPhotos([])
  }

  const handleUpload = async (file: File, city: string, category: string) => {
    const url = await uploadPhoto(file, city, '', category)
    if (url) { await loadActiveCities(); await loadCityPhotos(city) }
  }

  const handleDelete = async (photo: Photo) => {
    await deletePhoto(photo.id, photo.image_url)
    await loadActiveCities()
    if (selectedCity) await loadCityPhotos(selectedCity)
  }

  const isLight = theme === 'light'
  const bg = isLight ? 'bg-[var(--color-bg-warm)]' : 'bg-[var(--color-bg-dark)]'
  const border = isLight ? 'border-stone-200' : 'border-white/5'
  const text = isLight ? 'text-stone-700' : 'text-white/40'

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
          className={`${text} hover:opacity-70 text-sm tracking-wider transition-colors cursor-pointer`}
        >
          ← 返回
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-row">
        <div className={`${selectedProvince ? 'w-2/3' : 'flex-1'} p-4 flex items-center justify-center ${selectedCity ? 'border-r ' + border : ''}`}>
          <ChinaMap
            activeCities={activeCities}
            selectedCity={selectedCity}
            selectedProvince={selectedProvince}
            theme={theme}
            onThemeChange={(t) => { setTheme(t); localStorage.setItem(THEME_KEY, t) }}
            onSelect={handleSelect}
            onProvinceSelect={handleProvinceSelect}
          />
        </div>

        {/* Photo panel — only in province view */}
        {selectedProvince && (
          <div className={`w-1/3 p-4 border-l ${border}
            overflow-y-auto max-h-[50vh] md:max-h-full ${bg}
            [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-track]:bg-transparent`}
          >
            {selectedCity ? (
              <PhotoGallery
                city={selectedCity}
                photos={cityPhotos}
                theme={theme}
                onUpload={handleUpload}
                onDelete={handleDelete}
                onClose={() => setSelectedCity(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full py-10">
                <p className={isLight ? 'text-stone-500 text-sm' : 'text-white/40 text-sm'}>点击城市上传照片</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
