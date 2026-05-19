import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase 未配置，认证和数据库功能不可用。请复制 .env.example 为 .env 并填写你的 Supabase 项目信息。')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
