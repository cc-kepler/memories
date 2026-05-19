// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from 'react'

interface LabelPos { lng: number; lat: number }

interface ChinaMapProps {
  activeCities: Set<string>
  selectedCity: string | null
  selectedProvince: string | null
  theme?: 'dark' | 'light'
  onThemeChange: (t: 'dark' | 'light') => void
  onSelect: (city: string) => void
  onProvinceSelect: (prov: string | null) => void
}

export default function ChinaMap({ activeCities, selectedCity, selectedProvince, theme = 'dark', onThemeChange, onSelect, onProvinceSelect }: ChinaMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapData, setMapData] = useState<any>(null)
  const [labels, setLabels] = useState<Record<string, LabelPos>>({})
  const [editMode, setEditMode] = useState(false)
  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [dim, setDim] = useState({ w: 800, h: 600 })
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    fetch('/map_data.json').then(r => r.json()).then(setMapData).catch(() => {})
    fetch('/province_labels.json').then(r => r.json()).then(setLabels).catch(() => {})
  }, [])

  useEffect(() => {
    const upd = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect()
        const availH = window.innerHeight - r.top - 80
        setDim({ w: r.width || 800, h: Math.min(r.width * 0.78, availH) })
      }
    }
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const proj = useCallback((lng: number, lat: number) => {
    const b = { minLng: 73, maxLng: 135, minLat: 6, maxLat: 54 }
    const pad = 30
    const sc = Math.min((dim.w - pad * 2) / (b.maxLng - b.minLng), (dim.h - pad * 2) / (b.maxLat - b.minLat))
    return {
      x: (dim.w - (b.maxLng - b.minLng) * sc) / 2 + (lng - b.minLng) * sc,
      y: (dim.h - (b.maxLat - b.minLat) * sc) / 2 + (b.maxLat - lat) * sc,
    }
  }, [dim])

  const unproj = useCallback((px: number, py: number) => {
    const b = { minLng: 73, maxLng: 135, minLat: 6, maxLat: 54 }
    const pad = 30
    const sc = Math.min((dim.w - pad * 2) / (b.maxLng - b.minLng), (dim.h - pad * 2) / (b.maxLat - b.minLat))
    return {
      lng: b.minLng + (px - (dim.w - (b.maxLng - b.minLng) * sc) / 2) / sc,
      lat: b.maxLat - (py - (dim.h - (b.maxLat - b.minLat) * sc) / 2) / sc,
    }
  }, [dim])

  const activeProvs = new Set<string>()
  if (mapData) {
    for (const [city, prov] of Object.entries(mapData.cityProvince)) {
      if (activeCities.has(city)) activeProvs.add(prov as string)
    }
  }

  const isLight = theme === 'light'

  // Zoom to province if selected
  useEffect(() => {
    if (!mapData || !selectedProvince) {
      setTransform({ x: 0, y: 0, scale: 1 })
      return
    }
    const provData = mapData.provinces[selectedProvince]
    if (!provData) return
    const f = provData.features[0]
    let minX = 180, maxX = -180, minY = 90, maxY = -90
    const walk = (arr, d) => {
      if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
        if (d >= 3) { if (arr[0] < minX) minX = arr[0]; if (arr[0] > maxX) maxX = arr[0]; if (arr[1] < minY) minY = arr[1]; if (arr[1] > maxY) maxY = arr[1] }
      } else { arr.forEach(x => walk(x, d + 1)) }
    }
    walk(f.geometry.coordinates, 0)
    const { x: tlx, y: tly } = proj(minX, maxY)
    const { x: brx, y: bry } = proj(maxX, minY)
    const provW = brx - tlx || 100
    const provH = bry - tly || 100
    const pad = 100
    const s = Math.min((dim.w - pad * 2) / provW, (dim.h - pad * 2) / provH)
    const { x: cx, y: cy } = proj((minX + maxX) / 2, (maxY + minY) / 2)
    setTransform({ x: dim.w / 2 - cx * s, y: dim.h / 2 - cy * s, scale: s })
  }, [mapData, selectedProvince, dim, proj])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !mapData) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    canvas.width = dim.w * dpr
    canvas.height = dim.h * dpr
    canvas.style.width = dim.w + 'px'
    canvas.style.height = dim.h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, dim.w, dim.h)

    ctx.save()
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.scale, transform.scale)

    const fillRing = (ring) => {
      if (ring.length < 3) return
      ctx.beginPath()
      const p = proj(ring[0][0], ring[0][1])
      ctx.moveTo(p.x, p.y)
      for (let i = 1; i < ring.length; i++) {
        const pi = proj(ring[i][0], ring[i][1])
        ctx.lineTo(pi.x, pi.y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    const drawFeature = (coords, fill, stroke, lw, shadow?) => {
      ctx.save()
      if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = 8 }
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw
      if (Array.isArray(coords[0]?.[0]?.[0])) {
        for (const poly of coords) for (const ring of poly) fillRing(ring)
      } else {
        for (const ring of coords) fillRing(ring)
      }
      ctx.restore()
    }

    // Province outlines
    for (const [provName, provGeo] of Object.entries(mapData.provinces)) {
      const isActiveProv = activeProvs.has(provName)
      const isSelectedProv = provName === selectedProvince
      provGeo.features.forEach(f => {
        if (selectedProvince && isSelectedProv) {
          // Province view: selected province with warm golden fill distinct from coral cities
          drawFeature(f.geometry.coordinates,
            'rgba(190,165,130,0.20)',
            'rgba(190,165,130,0.45)', 0.4)
        } else if (selectedProvince) {
          // Province view: neighboring provinces subtle
          drawFeature(f.geometry.coordinates,
            'rgba(150,145,140,0.04)',
            'rgba(150,145,140,0.10)', 0.2)
        } else if (!selectedProvince && isActiveProv) {
          // National view: active province highlighted
          drawFeature(f.geometry.coordinates,
            'rgba(232,145,126,0.22)',
            'rgba(232,145,126,0.45)', 0.35)
        } else if (!selectedProvince) {
          // National view: inactive province subtle
          drawFeature(f.geometry.coordinates,
            isLight ? 'rgba(160,140,120,0.14)' : 'rgba(200,185,170,0.12)',
            isLight ? 'rgba(100,80,60,0.22)' : 'rgba(255,255,255,0.14)', 0.3)
        }
      })
    }

    // City outlines — only in province view
    if (selectedProvince) {
      for (const city of mapData.cities) {
        const cityName = city.properties.name.replace(/市$/, '').replace(/省$/, '').replace(/特别行政区$/, '')
        const prov = mapData.cityProvince[cityName]
        if (prov !== selectedProvince) continue
        const active = activeCities.has(cityName)
        const sel = selectedCity === cityName

        if (sel) {
          drawFeature(city.geometry.coordinates, 'rgba(210,130,160,0.50)', 'rgba(210,130,160,0.85)', 0.6, 'rgba(210,130,160,0.5)')
        } else if (active) {
          drawFeature(city.geometry.coordinates, 'rgba(232,145,126,0.35)', 'rgba(232,145,126,0.55)', 0.4)
        } else {
          drawFeature(city.geometry.coordinates,
            'rgba(150,145,140,0.06)',
            'rgba(150,145,140,0.12)', 0.2)
        }
      }
    }

    // Province labels
    {
      for (const [provName, pos] of Object.entries(labels)) {
        const { x, y } = proj(pos.lng, pos.lat)
        const shortName = provName.replace('特别行政区','').replace('壮族自治区','').replace('回族自治区','').replace('维吾尔自治区','').replace('自治区','').replace('省','').replace('市','')
        const isEditTarget = editMode && editTarget === provName
        const isSelectedProv = provName === selectedProvince
        if (isEditTarget) {
          ctx.fillStyle = 'rgba(232,145,126,0.5)'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
        }
        if (selectedProvince && isSelectedProv) {
          continue // selected province name shown in control bar instead
        } else if (selectedProvince) {
          ctx.fillStyle = isLight ? 'rgba(60,50,40,0.30)' : 'rgba(255,255,255,0.25)'
        } else {
          ctx.fillStyle = editMode ? 'rgba(232,145,126,0.7)' : (isLight ? 'rgba(60,50,40,0.55)' : 'rgba(255,255,255,0.45)')
        }
        const baseSize = selectedProvince ? 10 : 11
        ctx.font = `${Math.max(7, baseSize / transform.scale)}px system-ui`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(shortName, x, y)
      }
    }

    // City labels (province view only)
    if (selectedProvince) {
      for (const city of mapData.cities) {
        const cityName = city.properties.name.replace(/市$/, '').replace(/省$/, '').replace(/特别行政区$/, '')
        const prov = mapData.cityProvince[cityName]
        if (prov !== selectedProvince) continue
        const center = mapData.centers[cityName]
        if (!center) continue
        const { x, y } = proj(center.lng, center.lat)
        ctx.fillStyle = activeCities.has(cityName) ? 'rgba(232,145,126,0.8)' : (isLight ? 'rgba(60,50,40,0.55)' : 'rgba(255,255,255,0.5)')
        ctx.font = `${Math.max(2, 2 / transform.scale)}px system-ui`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(cityName, x, y)
      }
    }


    ctx.restore()
  }, [mapData, dim, transform, activeCities, selectedCity, selectedProvince, activeProvs, proj, labels, editMode, editTarget, isLight])

  // Interaction
  const dragRef = useRef({ on: false, sx: 0, sy: 0, tx: 0, ty: 0 })

  const onWheel = (e) => {
    e.preventDefault()
    setTransform(t => ({ ...t, scale: Math.max(0.5, Math.min(12, t.scale * (e.deltaY > 0 ? 0.9 : 1.1))) }))
  }
  const onDown = (e) => {
    const r = canvasRef.current?.getBoundingClientRect()
    if (!r) return
    dragRef.current = { on: true, sx: e.clientX - r.left, sy: e.clientY - r.top, tx: transform.x, ty: transform.y }
  }
  const onMove = (e) => {
    if (!dragRef.current.on || !canvasRef.current) return
    const r = canvasRef.current.getBoundingClientRect()
    if (!r) return
    setTransform(t => ({ ...t, x: dragRef.current.tx + (e.clientX - r.left - dragRef.current.sx), y: dragRef.current.ty + (e.clientY - r.top - dragRef.current.sy) }))
  }
  const onUp = (e) => {
    const r = canvasRef.current?.getBoundingClientRect()
    const moved = dragRef.current.on
    dragRef.current.on = false
    if (!moved || !r || !mapData) return

    const dx = Math.abs(e.clientX - r.left - dragRef.current.sx)
    const dy = Math.abs(e.clientY - r.top - dragRef.current.sy)
    const mapX = (e.clientX - r.left - transform.x) / transform.scale
    const mapY = (e.clientY - r.top - transform.y) / transform.scale

    // Edit mode
    if (editMode && !selectedProvince && dx < 5 && dy < 5) {
      if (editTarget) {
        const { lng, lat } = unproj(mapX, mapY)
        setLabels(prev => ({ ...prev, [editTarget]: { lng, lat } }))
        setEditTarget(null)
      } else {
        let best = null, bestDist = 30 / transform.scale
        for (const [name, pos] of Object.entries(labels)) {
          const { x, y } = proj(pos.lng, pos.lat)
          const d = Math.hypot(mapX - x, mapY - y)
          if (d < bestDist) { bestDist = d; best = name }
        }
        if (best) setEditTarget(best)
      }
      return
    }
    if (dx > 5 || dy > 5) return

    if (!selectedProvince) {
      // Check province label click first
      let bestProv = null, bestDist = 50 / transform.scale
      for (const [provName, pos] of Object.entries(labels)) {
        const { x, y } = proj(pos.lng, pos.lat)
        const d = Math.hypot(mapX - x, mapY - y)
        if (d < bestDist) { bestDist = d; bestProv = provName }
      }
      if (bestProv) { onProvinceSelect(bestProv); return }

      // Check city click
      let best = null; bestDist = 40 / transform.scale
      for (const [name, center] of Object.entries(mapData.centers)) {
        const { x, y } = proj(center.lng, center.lat)
        const d = Math.hypot(mapX - x, mapY - y)
        if (d < bestDist) { bestDist = d; best = name }
      }
      if (best) onSelect(best)
      else if (selectedCity) onSelect('')
    } else {
      // Province view: check city click (any province, larger hit area)
      let bestCity = null, bestCityProv = null, bestDist = 60 / transform.scale
      for (const [name, center] of Object.entries(mapData.centers)) {
        const { x, y } = proj(center.lng, center.lat)
        const d = Math.hypot(mapX - x, mapY - y)
        if (d < bestDist) { bestDist = d; bestCity = name; bestCityProv = mapData.cityProvince[name] }
      }
      if (bestCity && bestCityProv === selectedProvince) {
        onSelect(bestCity)
      } else if (bestCity && bestCityProv && bestCityProv !== selectedProvince) {
        onProvinceSelect(bestCityProv)
      } else if (selectedCity) {
        onSelect('')
      }
    }
  }

  if (!mapData) {
    return <div ref={containerRef} className="w-full flex items-center justify-center" style={{ minHeight: 550 }}>
      <p className="text-white/30 animate-pulse">地图数据加载中...</p>
    </div>
  }

  return (
    <div ref={containerRef} className="w-full select-none">
      {/* Controls */}
      <div className="relative flex items-center gap-3 mb-2 px-2">
        {selectedProvince && (
          <button onClick={() => onProvinceSelect(null)}
            className="text-xs px-4 py-1.5 rounded-full border border-[var(--color-coral-active)]/50
                       text-[var(--color-coral-active)] hover:bg-[var(--color-coral-active)]/10
                       cursor-pointer transition-colors font-medium shrink-0">
            ← 返回全国
          </button>
        )}
        {selectedCity && (
          <button onClick={() => onSelect('')}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-coral-active)]/50
                       text-[var(--color-coral-active)] hover:bg-[var(--color-coral-active)]/10
                       cursor-pointer transition-colors font-medium shrink-0">
            ✕ 取消选择
          </button>
        )}
        {selectedProvince && (
          <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium tracking-wider whitespace-nowrap"
            style={{ color: isLight ? '#e11d48' : '#fff' }}>
            {selectedProvince?.replace('省','').replace('市','').replace('自治区','')}
          </span>
        )}
        <div className="flex-1" />
        <button onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className={`shrink-0 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
            isLight ? 'border-stone-400 text-stone-500 hover:text-stone-800 hover:border-stone-600'
                    : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'}`}>
          {isLight ? '🌙 暗色' : '☀️ 亮色'}
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-1 mb-2">
        <div className="flex items-center gap-6 text-base font-semibold">
          <span style={{ color: isLight ? '#e11d48' : '#fff' }}>
            已激活省份 {activeProvs.size}/{Object.keys(mapData?.provinces || {}).length}
          </span>
          <span style={{ color: isLight ? '#e11d48' : '#fff' }}>
            已激活城市 {activeCities.size}/{mapData?.cities?.length || 370}
          </span>
        </div>
        <span className={isLight ? 'text-stone-500 text-xs' : 'text-white/25 text-xs'}>滚轮缩放 · 拖拽平移 · 双击复位</span>
        <span className={isLight ? 'text-stone-400 text-[11px]' : 'text-white/20 text-[11px]'}>点击省份 → 城市名称 上传照片来激活城市吧</span>
      </div>

      <canvas ref={canvasRef}
        style={{ width: dim.w, height: dim.h, cursor: editMode ? 'crosshair' : 'grab' }}
        onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
        onMouseLeave={() => { dragRef.current.on = false }}
        onDoubleClick={() => { if (!editMode && !selectedProvince) setTransform({ x: 0, y: 0, scale: 1 }) }}
      />
    </div>
  )
}
