// City coordinates (lat/lng) for SVG map projection
// Projection: eastern China focus, ~108-123°E, ~20-35°N

export interface CityCoord {
  name: string
  province: string
  lat: number
  lng: number
}

export const cities: CityCoord[] = [
  // 广东省 21
  { name: '广州', province: '广东', lat: 23.13, lng: 113.26 },
  { name: '深圳', province: '广东', lat: 22.54, lng: 114.06 },
  { name: '珠海', province: '广东', lat: 22.27, lng: 113.58 },
  { name: '汕头', province: '广东', lat: 23.35, lng: 116.68 },
  { name: '佛山', province: '广东', lat: 23.02, lng: 113.12 },
  { name: '韶关', province: '广东', lat: 24.80, lng: 113.60 },
  { name: '湛江', province: '广东', lat: 21.27, lng: 110.36 },
  { name: '肇庆', province: '广东', lat: 23.05, lng: 112.46 },
  { name: '江门', province: '广东', lat: 22.58, lng: 113.08 },
  { name: '茂名', province: '广东', lat: 21.66, lng: 110.92 },
  { name: '惠州', province: '广东', lat: 23.11, lng: 114.42 },
  { name: '梅州', province: '广东', lat: 24.29, lng: 116.12 },
  { name: '汕尾', province: '广东', lat: 22.79, lng: 115.38 },
  { name: '河源', province: '广东', lat: 23.74, lng: 114.70 },
  { name: '阳江', province: '广东', lat: 21.86, lng: 111.98 },
  { name: '清远', province: '广东', lat: 23.68, lng: 113.06 },
  { name: '东莞', province: '广东', lat: 23.02, lng: 113.75 },
  { name: '中山', province: '广东', lat: 22.52, lng: 113.38 },
  { name: '潮州', province: '广东', lat: 23.66, lng: 116.63 },
  { name: '揭阳', province: '广东', lat: 23.55, lng: 116.37 },
  { name: '云浮', province: '广东', lat: 22.92, lng: 112.04 },

  // 福建省 9
  { name: '福州', province: '福建', lat: 26.07, lng: 119.30 },
  { name: '厦门', province: '福建', lat: 24.48, lng: 118.09 },
  { name: '莆田', province: '福建', lat: 25.45, lng: 119.01 },
  { name: '三明', province: '福建', lat: 26.26, lng: 117.64 },
  { name: '泉州', province: '福建', lat: 24.87, lng: 118.67 },
  { name: '漳州', province: '福建', lat: 24.51, lng: 117.65 },
  { name: '南平', province: '福建', lat: 26.64, lng: 118.18 },
  { name: '龙岩', province: '福建', lat: 25.08, lng: 117.02 },
  { name: '宁德', province: '福建', lat: 26.67, lng: 119.55 },

  // 江苏省 13
  { name: '南京', province: '江苏', lat: 32.06, lng: 118.80 },
  { name: '无锡', province: '江苏', lat: 31.49, lng: 120.31 },
  { name: '徐州', province: '江苏', lat: 34.20, lng: 117.28 },
  { name: '常州', province: '江苏', lat: 31.81, lng: 119.97 },
  { name: '苏州', province: '江苏', lat: 31.30, lng: 120.62 },
  { name: '南通', province: '江苏', lat: 31.98, lng: 120.89 },
  { name: '连云港', province: '江苏', lat: 34.60, lng: 119.22 },
  { name: '淮安', province: '江苏', lat: 33.61, lng: 119.02 },
  { name: '盐城', province: '江苏', lat: 33.35, lng: 120.16 },
  { name: '扬州', province: '江苏', lat: 32.39, lng: 119.42 },
  { name: '镇江', province: '江苏', lat: 32.19, lng: 119.41 },
  { name: '泰州', province: '江苏', lat: 32.46, lng: 119.92 },
  { name: '宿迁', province: '江苏', lat: 33.96, lng: 118.28 },

  // 浙江省 11
  { name: '杭州', province: '浙江', lat: 30.27, lng: 120.15 },
  { name: '宁波', province: '浙江', lat: 29.87, lng: 121.54 },
  { name: '温州', province: '浙江', lat: 28.00, lng: 120.70 },
  { name: '嘉兴', province: '浙江', lat: 30.77, lng: 120.76 },
  { name: '湖州', province: '浙江', lat: 30.87, lng: 120.09 },
  { name: '绍兴', province: '浙江', lat: 30.05, lng: 120.58 },
  { name: '金华', province: '浙江', lat: 29.08, lng: 119.65 },
  { name: '衢州', province: '浙江', lat: 28.94, lng: 118.87 },
  { name: '舟山', province: '浙江', lat: 30.02, lng: 122.11 },
  { name: '台州', province: '浙江', lat: 28.66, lng: 121.42 },
  { name: '丽水', province: '浙江', lat: 28.47, lng: 119.92 },

  // 上海市
  { name: '上海', province: '上海', lat: 31.23, lng: 121.47 },

  // 安徽省 16
  { name: '合肥', province: '安徽', lat: 31.82, lng: 117.23 },
  { name: '芜湖', province: '安徽', lat: 31.33, lng: 118.43 },
  { name: '蚌埠', province: '安徽', lat: 32.92, lng: 117.39 },
  { name: '淮南', province: '安徽', lat: 32.65, lng: 117.02 },
  { name: '马鞍山', province: '安徽', lat: 31.68, lng: 118.51 },
  { name: '淮北', province: '安徽', lat: 33.96, lng: 116.80 },
  { name: '铜陵', province: '安徽', lat: 30.93, lng: 117.82 },
  { name: '安庆', province: '安徽', lat: 30.53, lng: 117.05 },
  { name: '黄山', province: '安徽', lat: 29.71, lng: 118.34 },
  { name: '滁州', province: '安徽', lat: 32.26, lng: 118.33 },
  { name: '阜阳', province: '安徽', lat: 32.89, lng: 115.81 },
  { name: '宿州', province: '安徽', lat: 33.65, lng: 116.98 },
  { name: '六安', province: '安徽', lat: 31.73, lng: 116.52 },
  { name: '亳州', province: '安徽', lat: 33.87, lng: 115.78 },
  { name: '池州', province: '安徽', lat: 30.66, lng: 117.49 },
  { name: '宣城', province: '安徽', lat: 30.94, lng: 118.76 },
]

// Projection: map lng/lat to SVG coordinates
// SVG viewBox covering ~108-123°E, 20-35°N
export function project(lng: number, lat: number, svgW: number, svgH: number) {
  const minLng = 108
  const maxLng = 123
  const minLat = 20
  const maxLat = 35
  const padding = 40

  const x = padding + ((lng - minLng) / (maxLng - minLng)) * (svgW - padding * 2)
  // Flip Y (map north = top)
  const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (svgH - padding * 2)
  return { x, y }
}
