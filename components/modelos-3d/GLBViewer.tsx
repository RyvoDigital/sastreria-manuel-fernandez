'use client'

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/** Latest atelier room scene (public/models) */
export const ENVIRONMENT_GLB = '/models/Environment_.glb'

/** Prefer these named cameras baked into the GLB (interior viewpoints) */
const CAMERA_PRIORITY = ['Camera_Front', 'Atelier_Camera', 'Camera_Fitting', 'Camera_Left'] as const

function findNamedObject(root: THREE.Object3D, names: readonly string[]): THREE.Object3D | null {
  for (const name of names) {
    let found: THREE.Object3D | null = null
    root.traverse((child) => {
      if (!found && child.name === name) found = child
    })
    if (found) return found
  }
  return null
}

function ModelCenterer({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const cloned = useMemo(() => scene.clone(true), [scene])

  // Keep every wall/ceiling visible (true interior). Soften baked lights.
  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        for (const mat of materials) {
          if (!mat) continue
          // Room walls are one-sided; double-side so interior always renders correctly
          mat.side = THREE.DoubleSide
          mat.needsUpdate = true
        }
      }
      if (child instanceof THREE.PointLight || child instanceof THREE.SpotLight) {
        child.intensity = Math.min(child.intensity / 400, 2)
      }
    })
  }, [cloned])

  const layout = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    // Fit room into view without making it tiny
    const s = 3.2 / maxDim

    const posX = -center.x * s
    const posY = -center.y * s
    const posZ = -center.z * s

    // Room AABB in world space after group transform
    const roomMin = box.min.clone().sub(center).multiplyScalar(s)
    const roomMax = box.max.clone().sub(center).multiplyScalar(s)
    const roomSize = roomMax.clone().sub(roomMin)

    // Use baked interior camera from the GLB when available
    const camNode = findNamedObject(cloned, CAMERA_PRIORITY)
    let camPos: THREE.Vector3
    let target: THREE.Vector3
    let fov = 50

    if (camNode) {
      camNode.updateWorldMatrix(true, false)
      const localPos = new THREE.Vector3()
      camNode.getWorldPosition(localPos)
      camPos = localPos.clone().sub(center).multiplyScalar(s)

      const quat = new THREE.Quaternion()
      camNode.getWorldQuaternion(quat)
      // glTF cameras look down local -Z
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(quat).normalize()
      // Look toward the middle of the room along the camera facing
      const lookDist = Math.min(roomSize.x, roomSize.z) * 0.45
      target = camPos.clone().add(dir.multiplyScalar(lookDist))
      // Keep target inside room
      target.x = THREE.MathUtils.clamp(target.x, roomMin.x + roomSize.x * 0.15, roomMax.x - roomSize.x * 0.15)
      target.y = THREE.MathUtils.clamp(target.y, roomMin.y + roomSize.y * 0.2, roomMax.y - roomSize.y * 0.25)
      target.z = THREE.MathUtils.clamp(target.z, roomMin.z + roomSize.z * 0.15, roomMax.z - roomSize.z * 0.15)

      // Perspective yfov from Camera_Front (~0.69 rad ≈ 40°)
      if (camNode.name === 'Camera_Front' || camNode.name === 'Camera_Fitting') {
        fov = 40
      }
    } else {
      // Fallback: stand near front wall, look toward back of atelier
      camPos = new THREE.Vector3(
        0,
        roomMin.y + roomSize.y * 0.52,
        roomMin.z + roomSize.z * 0.12
      )
      target = new THREE.Vector3(
        0,
        roomMin.y + roomSize.y * 0.38,
        roomMin.z + roomSize.z * 0.55
      )
    }

    // Stay inside the shell — never zoom out past the walls
    const minDistance = Math.min(roomSize.x, roomSize.z) * 0.08
    const maxDistance = Math.min(roomSize.x, roomSize.z) * 0.38
    const margin = {
      x: roomSize.x * 0.08,
      y: roomSize.y * 0.08,
      z: roomSize.z * 0.08,
    }

    return {
      scale: s,
      posX,
      posY,
      posZ,
      camPos,
      target,
      minDistance,
      maxDistance,
      roomMin,
      roomMax,
      margin,
      fov,
      groundY: roomMin.y - 0.002,
    }
  }, [cloned])

  useLayoutEffect(() => {
    camera.position.copy(layout.camPos)
    if ('fov' in camera) {
      ;(camera as THREE.PerspectiveCamera).fov = layout.fov
      camera.updateProjectionMatrix()
    }
  }, [camera, layout.camPos, layout.fov])

  // Hard clamp camera inside room bounds so orbit never shows the exterior shell
  useFrame(() => {
    const { roomMin, roomMax, margin } = layout
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      roomMin.x + margin.x,
      roomMax.x - margin.x
    )
    camera.position.y = THREE.MathUtils.clamp(
      camera.position.y,
      roomMin.y + margin.y,
      roomMax.y - margin.y
    )
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      roomMin.z + margin.z,
      roomMax.z - margin.z
    )
    controlsRef.current?.update()
  })

  return (
    <>
      <group scale={layout.scale} position={[layout.posX, layout.posY, layout.posZ]}>
        <primitive object={cloned} />
      </group>

      {/* Floor underlay only under the room, not a huge exterior ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, layout.groundY, 0]}>
        <planeGeometry
          args={[
            (layout.roomMax.x - layout.roomMin.x) * 1.02,
            (layout.roomMax.z - layout.roomMin.z) * 1.02,
          ]}
        />
        <meshBasicMaterial color="#1a1208" />
      </mesh>

      <ambientLight intensity={0.45} />
      <hemisphereLight intensity={0.35} color="#fff8f0" groundColor="#1a1208" />
      <directionalLight
        intensity={0.35}
        position={[0.5, 2, 0.3]}
        color="#fff5e6"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        autoRotate={false}
        enablePan={false}
        enableZoom={true}
        enableDamping
        dampingFactor={0.08}
        minDistance={layout.minDistance}
        maxDistance={layout.maxDistance}
        target={layout.target}
        // Keep view roughly eye-level inside the room
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.62}
        // Limit yaw so you stay facing the interior
        minAzimuthAngle={-Math.PI * 0.55}
        maxAzimuthAngle={Math.PI * 0.55}
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

export function GLBViewer({
  url = ENVIRONMENT_GLB,
  height = '70vh',
  minHeight = 500,
}: {
  url?: string
  height?: string | number
  minHeight?: number
}) {
  useEffect(() => {
    useGLTF.preload(url)
  }, [url])

  return (
    <div
      style={{
        width: '100%',
        height,
        minHeight,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(201,168,76,0.2)',
        background: '#0A1628',
      }}
    >
      <Canvas
        camera={{ fov: 45, near: 0.05, far: 100 }}
        style={{ background: '#0A1628', width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0A1628']} />
        <Suspense fallback={<LoadingFallback />}>
          <ModelCenterer url={url} />
        </Suspense>
      </Canvas>
    </div>
  )
}
