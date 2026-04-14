'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'
import { Loader2, User } from 'lucide-react'

interface Modelo3DViewerProps {
  modelUrl?: string
}

type ModelType = 'male' | 'female'

// Full Environment - combines all 4 view pieces to form a room
function FullEnvironment() {
  const { scene: frontScene } = useGLTF('/models/3d_env_frontview.glb')
  const { scene: backScene } = useGLTF('/models/3d_env_backview.glb')
  const { scene: leftScene } = useGLTF('/models/3d_env_leftview.glb')
  const { scene: rightScene } = useGLTF('/models/3d_env_rightview.glb')

  return (
    <group>
      {/* Front wall - facing inward (toward +Z) */}
      <primitive object={frontScene.clone()} position={[0, 0, -3]} rotation={[0, 0, 0]} />
      
      {/* Back wall - facing inward (toward -Z) */}
      <primitive object={backScene.clone()} position={[0, 0, 3]} rotation={[0, Math.PI, 0]} />
      
      {/* Left wall - facing inward (toward +X) */}
      <primitive object={leftScene.clone()} position={[-3, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Right wall - facing inward (toward -X) */}
      <primitive object={rightScene.clone()} position={[3, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  )
}

// Character Model
function CharacterModel({ path, scale = 1 }: { path: string; scale?: number }) {
  const { scene } = useGLTF(path)
  
  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  )
}

// Loading fallback
function Loader() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      background: 'rgba(5,12,20,0.9)',
    }}>
      <Loader2 size={48} color="#C9A84C" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)',
      }}>
        Cargando modelo 3D...
      </span>
    </div>
  )
}

export function Modelo3DViewer({ modelUrl }: Modelo3DViewerProps) {
  const [modelType, setModelType] = useState<ModelType>('male')
  const [showEnvironment, setShowEnvironment] = useState(true)

  const modelPaths = {
    male: '/models/male_model.glb',
    female: '/models/female_model.glb',
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexWrap: 'wrap',
      }}>
        {/* Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Modelo:
          </span>
          {(['male', 'female'] as ModelType[]).map((type) => (
            <button
              key={type}
              onClick={() => setModelType(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: modelType === type ? '#C9A84C' : 'rgba(255,255,255,0.05)',
                color: modelType === type ? '#000' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${modelType === type ? '#C9A84C' : 'rgba(255,255,255,0.2)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <User size={14} />
              {type === 'male' ? 'Hombre' : 'Mujer'}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Environment Toggle */}
        <button
          onClick={() => setShowEnvironment(!showEnvironment)}
          style={{
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: showEnvironment ? 'rgba(201,168,76,0.2)' : 'transparent',
            color: showEnvironment ? '#C9A84C' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${showEnvironment ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.15)'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {showEnvironment ? 'Ocultar Entorno' : 'Mostrar Entorno'}
        </button>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 1.6, 0], fov: 60 }}
          style={{ background: 'linear-gradient(to bottom, #0A1628, #050C14)' }}
        >
          {/* Better lighting for the room */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 10, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 0]} intensity={0.8} />
          
          <Suspense fallback={null}>
            {/* Full Environment (all 4 pieces combined) */}
            {showEnvironment && (
              <group scale={1}>
                <FullEnvironment />
              </group>
            )}
            
            {/* Character Model - standing in center */}
            <group position={[0, -1, 0]}>
              <CharacterModel path={modelPaths[modelType]} scale={1} />
            </group>
          </Suspense>
          
          <OrbitControls 
            enablePan={true}
            minDistance={1}
            maxDistance={8}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.5, 0]}
          />
        </Canvas>

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.75rem 1.5rem',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '2rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          🖱️ Arrastra para rotar • Scroll para zoom
        </div>
      </div>
    </div>
  )
}

// Preload all models
useGLTF.preload('/models/male_model.glb')
useGLTF.preload('/models/female_model.glb')
useGLTF.preload('/models/3d_env_frontview.glb')
useGLTF.preload('/models/3d_env_backview.glb')
useGLTF.preload('/models/3d_env_leftview.glb')
useGLTF.preload('/models/3d_env_rightview.glb')
