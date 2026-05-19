// Batch upload map photos from photos/地图/ to Supabase
// Usage: node scripts/upload_map_photos.mjs
//
// Before running, set your Supabase service_role key:
//   1. Go to https://supabase.com/dashboard → your project → Settings → API
//   2. Copy the "service_role secret" (NOT the anon key)
//   3. Set it: export SUPABASE_SERVICE_KEY="eyJh..."
//
// Directory structure expected:
//   photos/地图/
//     惠州/
//       第一天/    ← category
//          photo1.jpg
//          photo2.jpg
//       鹿江公园/  ← category
//          photo3.jpg

import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, basename, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = 'https://kgiunbeilmmtzldyvkfu.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY not set.')
  console.error('')
  console.error('1. Go to https://supabase.com/dashboard → your project → Settings → API')
  console.error('2. Copy the "service_role secret"')
  console.error('3. Run: export SUPABASE_SERVICE_KEY="your-key-here"')
  console.error('4. Re-run: node scripts/upload_map_photos.mjs')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const BASE_DIR = join(__dirname, '..', 'photos', '地图')

if (!existsSync(BASE_DIR)) {
  console.error(`Directory not found: ${BASE_DIR}`)
  process.exit(1)
}

async function uploadPhoto(filePath, city, category) {
  const ext = extname(filePath) || '.jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const storagePath = `photos/${fileName}`

  const fileBuffer = readFileSync(filePath)

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('memories')
    .upload(storagePath, fileBuffer, {
      contentType: `image/${ext.replace('.', '')}`,
      upsert: true,
    })

  if (uploadError) {
    console.error(`  Upload failed: ${uploadError.message}`)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('memories')
    .getPublicUrl(storagePath)

  const publicUrl = urlData.publicUrl

  // Insert into photos table
  const { error: insertError } = await supabase
    .from('photos')
    .insert({
      city,
      category,
      photo_date: new Date().toISOString().split('T')[0],
      image_url: publicUrl,
    })

  if (insertError) {
    console.error(`  Insert failed: ${insertError.message}`)
    return null
  }

  return publicUrl
}

async function main() {
  console.log('Scanning directory:', BASE_DIR)
  console.log('')

  const cities = readdirSync(BASE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  console.log(`Found ${cities.length} cities: ${cities.join(', ')}`)
  console.log('')

  let total = 0
  let success = 0
  let failed = 0

  for (const city of cities) {
    const cityDir = join(BASE_DIR, city)
    const categories = readdirSync(cityDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    console.log(`📁 ${city} (${categories.length} categories)`)

    for (const category of categories) {
      const catDir = join(cityDir, category)
      const files = readdirSync(catDir, { withFileTypes: true })
        .filter(f => f.isFile())
        .filter(f => /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(f.name))
        .map(f => f.name)

      console.log(`  📂 ${category} (${files.length} photos)`)

      for (const file of files) {
        const filePath = join(catDir, file)
        total++
        process.stdout.write(`    📷 ${file} ... `)
        const url = await uploadPhoto(filePath, city, category)
        if (url) {
          success++
          console.log('OK')
        } else {
          failed++
          console.log('FAIL')
        }
      }
    }
    console.log('')
  }

  console.log('────────────────────────')
  console.log(`Total: ${total} | Success: ${success} | Failed: ${failed}`)
}

main().catch(console.error)
