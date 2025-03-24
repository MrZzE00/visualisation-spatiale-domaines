import React, { useEffect, useState, Suspense, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Stars, 
  Environment,
  useGLTF,
  useTexture,
  useHelper,
  Stats,
  PerspectiveCamera
} from '@react-three/drei'
// Effets désactivés temporairement pour améliorer les performances
// import { 
//   EffectComposer,
//   Bloom,
//   Vignette
// } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import SpaceScene from './components/SpaceScene'
import DomainInfo from './components/DomainInfo'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'
import { mainDomains, getDomainById, updateDomainData } from './data/domains'
import { gsap } from 'gsap'
import './index.css'

// Composant pour les effets d'éclairage avancés
const LightSetup = () => {
  const mainLight = useRef()
  const secondaryLight = useRef()
  
  // Pour le débogage des lumières (commenter en production)
  // useHelper(mainLight, THREE.PointLightHelper, 1, 'red')
  // useHelper(secondaryLight, THREE.PointLightHelper, 1, 'blue')
  
  return (
    <>
      {/* Lumière ambiante générale */}
      <ambientLight intensity={0.15} />
      
      {/* Lumière principale */}
      <pointLight 
        ref={mainLight}
        position={[20, 30, 10]} 
        intensity={1} 
        color="#fff" 
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      
      {/* Lumière secondaire pour relief */}
      <pointLight 
        ref={secondaryLight}
        position={[-30, -20, -10]} 
        intensity={0.4} 
        color="#66a0ff" 
      />
      
      {/* Lumière d'accent pour l'atmosphère */}
      <pointLight 
        position={[0, 0, 30]} 
        intensity={0.3} 
        color="#ff6a00" 
      />
    </>
  )
}

// Composant d'effets post-processing désactivé pour améliorer les performances
// const PostProcessing = () => {
//   return (
//     <EffectComposer>
//       <Bloom 
//         intensity={0.2}
//         luminanceThreshold={0.3}
//         luminanceSmoothing={0.9}
//         height={256}
//       />
//       <Vignette
//         offset={0.3}
//         darkness={0.7}
//         opacity={0.5}
//       />
//     </EffectComposer>
//   )
// }

// Composant principal
const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeDomain, setActiveDomain] = useState(null)
  const [hoveredDomain, setHoveredDomain] = useState(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)
  const [isCameraAnimating, setIsCameraAnimating] = useState(false)
  const [isZoomedOut, setIsZoomedOut] = useState(false)
  const controlsRef = useRef()
  
  // État pour suivre si la scène est visible
  const [isSceneVisible, setIsSceneVisible] = useState(false)

  // Simuler un chargement progressif
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Activer la scène après le chargement
      setIsSceneVisible(true)
    }, 3000)

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.01
        return newProgress >= 1 ? 1 : newProgress
      })
    }, 20)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  // Gestion des interactions avec les domaines
  const handleDomainClick = useCallback((domain, zoomedOut = false) => {
    setActiveDomain(domain)
    setIsInfoOpen(true)
    setIsCameraAnimating(true)
    setIsZoomedOut(zoomedOut)
    
    // Désactiver temporairement les contrôles orbitaux pendant l'animation
    if (controlsRef.current) {
      controlsRef.current.enabled = !zoomedOut
    }
    
    // Animation terminée après la durée
    setTimeout(() => {
      setIsCameraAnimating(false)
    }, 2000)
  }, [])

  const handleCloseInfo = useCallback(() => {
    setIsInfoOpen(false)
    setActiveDomain(null)
    setIsZoomedOut(false)
    
    // Réactiver les contrôles orbitaux
    if (controlsRef.current) {
      controlsRef.current.enabled = true
    }
  }, [])
  
  // Réinitialiser la vue
  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    setIsInfoOpen(false)
    setActiveDomain(null)
    setHoveredDomain(null)
    setIsZoomedOut(false)
    
    // Animation de retour à la vue initiale
    setIsCameraAnimating(true)
    setTimeout(() => {
      setIsCameraAnimating(false)
    }, 2000)
  }, [])
  
  // Naviguer vers un domaine spécifique
  const handleDomainSelect = useCallback((domainId) => {
    const domain = getDomainById(domainId)
    if (domain) {
      handleDomainClick(domain)
    }
  }, [handleDomainClick])
  
  // Basculer le mode performance
  const togglePerformanceMode = useCallback(() => {
    setPerformanceMode(prev => !prev)
  }, [])
  
  // Survol d'un domaine (utilisé dans la navigation)
  const handleDomainHover = useCallback((domain) => {
    setHoveredDomain(domain)
  }, [])

  // Gérer les modifications de données (noms de domaines, verbes, etc.)
  const handleDataChange = useCallback((action) => {
    // Appliquer la modification
    const success = updateDomainData(action);
    
    // Si la modification est réussie, forcer une mise à jour de l'interface
    if (success) {
      // Si on modifie le domaine actif, mettre à jour l'état pour forcer le rendu
      if (action.type === 'updateDomainName' && activeDomain?.id === action.domainId) {
        const updatedDomain = getDomainById(action.domainId);
        setActiveDomain({ ...updatedDomain });
      }
      
      // Pour le mode débogage, on peut ajouter un message de confirmation
      if (import.meta.env.DEV) {
        console.log('Modification appliquée:', action);
      }
    }
  }, [activeDomain]);

  return (
    <div className="app">
      {isLoading ? (
        <LoadingScreen progress={progress} />
      ) : (
        <>
          {/* Contrôles d'interface */}
          <div className="ui-controls absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button 
              onClick={togglePerformanceMode}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                performanceMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {performanceMode ? '🚀 Mode Performance' : '✨ Mode Qualité'}
            </button>
            
            {activeDomain && (
              <button 
                onClick={handleResetView}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                ↩️ Vue Globale
              </button>
            )}
          </div>
          
          {/* Canvas 3D */}
          <Canvas
            shadows={!performanceMode} // Désactiver les ombres en mode performance
            dpr={performanceMode ? 1 : Math.min(1.5, window.devicePixelRatio)} // Résolution réduite en mode performance
            camera={{ position: [0, 20, 40], fov: 50, near: 0.1, far: 1000 }}
            style={{ background: 'radial-gradient(circle at center, #0a0a2a 0%, #050510 100%)' }}
            frameloop={isSceneVisible ? 'always' : 'demand'}
            performance={{ min: 0.5, max: 0.8 }} // Limiter les performances pour éviter les plantages
          >
            <fog attach="fog" args={['#070720', 30, 150]} />
            
            {/* Éclairage */}
            <LightSetup />
            
            {/* Scène principale */}
            <Suspense fallback={null}>
              {isSceneVisible && (
                <>
                  <SpaceScene 
                    onDomainClick={handleDomainClick}
                    activeDomain={activeDomain}
                    hoveredDomain={hoveredDomain}
                    performanceMode={performanceMode}
                    onDataChange={handleDataChange}
                  />
                  <Stars radius={100} depth={50} count={isSceneVisible ? (performanceMode ? 1000 : 1500) : 0} factor={4} saturation={0.5} fade speed={0.5} />
                  
                  {/* Effets post-processing désactivés */}
                  {/* <PostProcessing /> */}
                </>
              )}
            </Suspense>
            
            {/* Contrôles de caméra */}
            <OrbitControls 
              ref={controlsRef}
              enabled={!isCameraAnimating}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={10}
              maxDistance={100}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
            />
            
            {/* Afficher les stats uniquement en développement */}
            {import.meta.env.DEV && !performanceMode && <Stats />}
          </Canvas>
          
          {/* Panneau d'information */}
          <DomainInfo 
            domain={activeDomain} 
            isOpen={isInfoOpen} 
            onClose={handleCloseInfo}
            onDataChange={handleDataChange}
          />
          
          {/* Navigation */}
          <Navigation 
            domains={mainDomains.filter(d => d.type?.includes('Principal'))}
            activeDomain={activeDomain}
            onDomainSelect={handleDomainSelect}
            onDomainHover={handleDomainHover}
            onResetHover={() => setHoveredDomain(null)}
          />
          
          {/* Aide contextuelle */}
          <div className="absolute bottom-0 left-0 text-xs sm:text-sm text-white/60 bg-blue-900/20 p-1.5 sm:p-2 backdrop-blur-sm rounded-tr-lg border-t border-r border-white/10">
            <p className="leading-tight">
              Souris: navigation | Clic: explorer
              {!performanceMode && " | 🚀: performance"}
            </p>
          </div>
          
          {/* Crédit */}
          <div className="absolute bottom-0 right-0 text-xs sm:text-sm text-white/60 bg-blue-900/20 p-1.5 sm:p-2 backdrop-blur-sm rounded-tl-lg border-t border-l border-white/10">
            © 2025 MrZzE00 - SAFe Visualisation
          </div>
        </>
      )}
    </div>
  )
}

export default App 