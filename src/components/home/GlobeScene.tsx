// @ts-nocheck
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const groupRef = useRef<THREE.Group>(null)
  const earthMap = useLoader(THREE.TextureLoader, '/earth.jpg')
  earthMap.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[1.55, 64, 32]}>
        <meshStandardMaterial map={earthMap} roughness={0.55} metalness={0.01} />
      </Sphere>
    </group>
  )
}

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4.5 + Math.random() * 3
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={500} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#ffffff" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// Fully standalone - never re-renders
export default function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <ambientLight intensity={0.5} color="#d0e4f4" />
      <directionalLight position={[8, 4, 6]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-2, -1, -4]} intensity={0.5} color="#c8ddf0" />
      <Stars />
      <Earth />
    </Canvas>
  )
}
