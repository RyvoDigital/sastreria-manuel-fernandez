'use client'

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function ModelCenterer({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera } = useThree()

  // Hide front wall & ceiling for interior dollhouse view,
  // normalize crazy bright built-in lights
  useEffect(() => {
    scene.traverse((child) => {
      if (
        child.name === 'Front_Wall' ||
        child.name === 'Ceiling' ||
        child.name === 'Baseboard_Front'
      ) {
        child.visible = false
      }
      if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
        child.intensity = child.intensity / 500
      }
    })
  }, [scene])

  // Compute placement
  const { scale, posX, posY, posZ, camPos, target, minDistance, maxDistance, groundY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = 2 / maxDim

    const px = -center.x * s
    const py = -center.y * s
    const pz = -center.z * s

    // World-space bounds after centering & scaling
    const worldMinY = (box.min.y - center.y) * s
    const worldMaxY = (box.max.y - center.y) * s
    const worldMinZ = (box.min.z - center.z) * s
    const worldMaxZ = (box.max.z - center.z) * s
    const roomDepth = worldMaxZ - worldMinZ

    // Camera placed in the middle of the room, looking toward the back
    const camWorld = new THREE.Vector3(
      0,
      worldMinY + (worldMaxY - worldMinY) * 0.55,
      worldMinZ + roomDepth * 0.35
    )

    const targetWorld = new THREE.Vector3(
      0,
      worldMinY + (worldMaxY - worldMinY) * 0.25,
      worldMinZ + roomDepth * 0.65
    )

    return {
      scale: s,
      posX: px,
      posY: py,
      posZ: pz,
      camPos: camWorld,
      target: targetWorld,
      minDistance: roomDepth * 0.25,
      maxDistance: roomDepth * 1.1,
      groundY: worldMinY - 0.005,
    }
  }, [scene])

  useLayoutEffect(() => {
    camera.position.copy(camPos)
  }, [camera, camPos])

  return (
    <>
      {/* Scaled & centered model */}
      <group scale={scale} position={[posX, posY, posZ]}>
        <primitive object={scene} />
      </group>

      {/* Ground plane to hide the void below the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, groundY, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#0A1628" />
      </mesh>

      {/* Fill lights */}
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.3} color="#ffffff" groundColor="#0A1628" />

      <OrbitControls
        autoRotate={false}
        enablePan={true}
        enableZoom={true}
        minDistance={minDistance}
        maxDistance={maxDistance}
        target={target}
        minPolarAngle={0.8}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#C9A84C" wireframe />
    </mesh>
  )
}

export function GLBViewer({ url }: { url: string }) {
  return (
    <div style={{ width: '100%', height: '70vh', minHeight: '500px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
      <Canvas
        camera={{ fov: 50 }}
        style={{ background: '#0A1628' }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#0A1628']} />
        <Suspense fallback={<LoadingFallback />}>
          <ModelCenterer url={url} />
        </Suspense>
      </Canvas>
    </div>
  )
}
