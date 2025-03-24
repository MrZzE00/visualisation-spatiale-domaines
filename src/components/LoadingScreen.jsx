import React, { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initialisation...')
  
  // Simulation de la progression du chargement
  useEffect(() => {
    const loadingMessages = [
      'Initialisation...',
      'Chargement des domaines...',
      'Préparation des shaders...',
      'Création de l\'univers...',
      'Prêt à explorer!'
    ]
    
    // Calcul du temps par étape
    const totalDuration = 2500 // ms
    const stepsCount = loadingMessages.length
    const stepDuration = totalDuration / stepsCount
    
    // Progression régulière
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 50))
        return Math.min(newProgress, 100)
      })
    }, 50)
    
    // Mise à jour des messages de chargement
    loadingMessages.forEach((message, index) => {
      setTimeout(() => {
        setLoadingText(message)
      }, index * stepDuration)
    })
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      {/* Logo/titre animé */}
      <div className="mb-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-white relative">
          <span className="text-blue-400">Espace</span> des <span className="text-yellow-400">connaissances</span>
        </h1>
        <div className="absolute -inset-4 border-2 border-white/20 rounded-xl -z-10 animate-pulse"></div>
      </div>
      
      {/* Planètes animées */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute w-full h-full flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full bg-blue-600 opacity-80"
            style={{
              animation: 'orbit 4s linear infinite',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
            }}
          ></div>
        </div>
        <div className="absolute w-full h-full flex items-center justify-center">
          <div 
            className="w-6 h-6 rounded-full bg-yellow-400 absolute"
            style={{
              animation: 'orbit 2s linear infinite',
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)',
              left: '75%'
            }}
          ></div>
        </div>
        <div className="absolute w-full h-full flex items-center justify-center">
          <div 
            className="w-4 h-4 rounded-full bg-green-400 absolute"
            style={{
              animation: 'orbit 3s linear infinite',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.6)',
              left: '25%',
              top: '65%'
            }}
          ></div>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="w-64 md:w-80 h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
        ></div>
      </div>
      
      {/* Texte de chargement */}
      <p className="text-white/70 text-sm">{loadingText}</p>
      
      {/* Ajouter une balise style globale au lieu de jsx */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes orbit {
            0% {
              transform: rotate(0deg) translateX(20px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(20px) rotate(-360deg);
            }
          }
        `
      }} />
    </div>
  )
}

export default LoadingScreen 