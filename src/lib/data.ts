import { supabase } from './supabase'

export interface Log {
  id: string
  title: string
  content: string
  log_date: string
  created_at: string
}

export interface Photo {
  id: string
  city: string
  photo_date: string
  image_url: string
  category: string
  created_at: string
}

// Get all dates that have logs or photos
export async function getAvailableDates(): Promise<string[]> {
  const [{ data: logDates }, { data: photoDates }] = await Promise.all([
    supabase.from('logs').select('log_date'),
    supabase.from('photos').select('photo_date').eq('city', ''),
  ])

  const dates = new Set<string>()
  logDates?.forEach((d) => dates.add(d.log_date))
  photoDates?.forEach((d) => dates.add(d.photo_date))

  return Array.from(dates).sort((a, b) => b.localeCompare(a))
}

// Get logs for a specific date
export async function getLogsByDate(date: string): Promise<Log[]> {
  const { data } = await supabase
    .from('logs')
    .select('*')
    .eq('log_date', date)
    .order('created_at', { ascending: false })

  return data || []
}

// Create a new log
export async function createLog(log: { title: string; content: string; log_date: string }) {
  const { data, error } = await supabase.from('logs').insert(log).select().single()
  return { data, error }
}

// Update a log
export async function updateLog(id: string, updates: { title?: string; content?: string }) {
  const { error } = await supabase.from('logs').update(updates).eq('id', id)
  return { error }
}

// Delete a log
export async function deleteLog(id: string) {
  const { error } = await supabase.from('logs').delete().eq('id', id)
  return { error }
}

// Get photos for a specific date
export async function getPhotosByDate(date: string): Promise<Photo[]> {
  const { data } = await supabase
    .from('photos')
    .select('*')
    .eq('photo_date', date)
    .eq('city', '') // 日志页：只显示无城市关联的照片
    .order('created_at', { ascending: false })

  return data || []
}

// Upload a photo
export async function uploadPhoto(file: File, city: string, photoDate: string, category = ''): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('memories')
    .upload(`photos/${path}`, file)

  if (uploadError) return null

  const { data: urlData } = supabase.storage
    .from('memories')
    .getPublicUrl(`photos/${path}`)

  const { error: insertError } = await supabase
    .from('photos')
    .insert({
      city,
      photo_date: photoDate,
      image_url: urlData.publicUrl,
      category,
    })

  if (insertError) return null

  return urlData.publicUrl
}

// Delete a photo
export async function deletePhoto(id: string, imageUrl: string) {
  const path = imageUrl.split('/memories/')[1]
  if (path) {
    await supabase.storage.from('memories').remove([path])
  }
  const { error } = await supabase.from('photos').delete().eq('id', id)
  return { error }
}
