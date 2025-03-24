import React, { useMemo } from 'react'
import * as THREE from 'three'

// Générateur de textures procédurales pour les différents types de surfaces planétaires
export const generatePlanetTexture = (type, size = 1024, seed = Math.random() * 10000) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  // Couleur de base et propriétés selon le type
  let baseColor, noiseIntensity, spotIntensity, ringIntensity
  
  switch (type) {
    case 'rocky':
      baseColor = { r: 139, g: 69, b: 19 }
      noiseIntensity = 0.8
      spotIntensity = 0.5
      ringIntensity = 0.3
      break
    case 'desert':
      baseColor = { r: 210, g: 180, b: 140 }
      noiseIntensity = 0.6
      spotIntensity = 0.7
      ringIntensity = 0.2
      break
    case 'oceanic':
      baseColor = { r: 65, g: 105, b: 225 }
      noiseIntensity = 0.4
      spotIntensity = 0.3
      ringIntensity = 0.6
      break
    case 'volcanic':
      baseColor = { r: 139, g: 0, b: 0 }
      noiseIntensity = 0.9
      spotIntensity = 0.8
      ringIntensity = 0.4
      break
    case 'forested':
      baseColor = { r: 34, g: 139, b: 34 }
      noiseIntensity = 0.7
      spotIntensity = 0.4
      ringIntensity = 0.3
      break
    case 'crystalline':
      baseColor = { r: 70, g: 130, b: 180 }
      noiseIntensity = 0.5
      spotIntensity = 0.9
      ringIntensity = 0.7
      break
    case 'grid-like':
      baseColor = { r: 46, g: 139, b: 87 }
      noiseIntensity = 0.3
      spotIntensity = 0.2
      ringIntensity = 0.8
      break
    case 'glassy':
      baseColor = { r: 173, g: 216, b: 230 }
      noiseIntensity = 0.2
      spotIntensity = 0.1
      ringIntensity = 0.5
      break
    case 'solid':
      baseColor = { r: 147, g: 112, b: 219 }
      noiseIntensity = 0.1
      spotIntensity = 0.3
      ringIntensity = 0.4
      break
    case 'void-like':
      baseColor = { r: 25, g: 25, b: 112 }
      noiseIntensity = 0.9
      spotIntensity = 0.2
      ringIntensity = 0.7
      break
    case 'secure':
      baseColor = { r: 0, g: 128, b: 128 }
      noiseIntensity = 0.4
      spotIntensity = 0.6
      ringIntensity = 0.3
      break
    case 'structured':
      baseColor = { r: 219, g: 112, b: 147 }
      noiseIntensity = 0.5
      spotIntensity = 0.3
      ringIntensity = 0.4
      break
    case 'patterned':
      baseColor = { r: 255, g: 140, b: 0 }
      noiseIntensity = 0.6
      spotIntensity = 0.7
      ringIntensity = 0.5
      break
    default:
      baseColor = { r: 100, g: 100, b: 100 }
      noiseIntensity = 0.5
      spotIntensity = 0.5
      ringIntensity = 0.5
  }
  
  // Fonction pour générer du bruit Perlin-like (simplifié)
  const noise = (x, y, frequency = 1) => {
    const xf = x * frequency + seed
    const yf = y * frequency + seed
    
    const ix = Math.floor(xf)
    const iy = Math.floor(yf)
    
    const fx = xf - ix
    const fy = yf - iy
    
    const a = pseudoRandom(ix, iy)
    const b = pseudoRandom(ix + 1, iy)
    const c = pseudoRandom(ix, iy + 1)
    const d = pseudoRandom(ix + 1, iy + 1)
    
    const ux = smoothStep(fx)
    const uy = smoothStep(fy)
    
    return lerp(
      lerp(a, b, ux),
      lerp(c, d, ux),
      uy
    )
  }
  
  // Fonction de lissage
  const smoothStep = (t) => t * t * (3 - 2 * t)
  
  // Interpolation linéaire
  const lerp = (a, b, t) => a + t * (b - a)
  
  // Générateur de valeurs pseudo-aléatoires
  const pseudoRandom = (x, y) => {
    const dot = x * 12.9898 + y * 78.233
    return Math.abs(Math.sin(dot) * 43758.5453) % 1
  }
  
  // Remplir le canvas
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Coordonnées normalisées
      const nx = x / size - 0.5
      const ny = y / size - 0.5
      const dist = Math.sqrt(nx * nx + ny * ny) * 2 // Distance du centre (0-1)
      
      // Générer plusieurs couches de bruit
      let noiseValue = 0
      noiseValue += noise(nx, ny, 4) * 0.5
      noiseValue += noise(nx, ny, 8) * 0.25
      noiseValue += noise(nx, ny, 16) * 0.125
      noiseValue += noise(nx, ny, 32) * 0.0625
      
      // Ajouter des motifs circulaires pour certains types
      let ringValue = 0
      if (ringIntensity > 0) {
        ringValue = Math.sin(dist * Math.PI * 8) * 0.5 + 0.5
        ringValue = Math.pow(ringValue, 2) * ringIntensity
      }
      
      // Ajouter des "spots" aléatoires pour certains types
      let spotValue = 0
      if (spotIntensity > 0) {
        const spotCount = 10
        for (let i = 0; i < spotCount; i++) {
          const sx = Math.sin(seed + i * 1.5) * 0.4
          const sy = Math.cos(seed + i * 1.5) * 0.4
          const sDist = Math.sqrt((nx - sx) * (nx - sx) + (ny - sy) * (ny - sy))
          spotValue += Math.max(0, 1 - sDist * 10) * (noise(i, i, 1) * 0.5 + 0.5)
        }
        spotValue = Math.min(1, spotValue) * spotIntensity
      }
      
      // Assombrir vers les bords pour l'effet de sphère
      const edgeDarkening = 1 - Math.pow(dist, 2) * 0.5
      
      // Combiner tous les effets
      const finalValue = (
        noiseValue * noiseIntensity + 
        ringValue + 
        spotValue
      ) * edgeDarkening
      
      // Appliquer à la couleur de base
      const r = Math.floor(baseColor.r * (0.7 + finalValue * 0.3))
      const g = Math.floor(baseColor.g * (0.7 + finalValue * 0.3))
      const b = Math.floor(baseColor.b * (0.7 + finalValue * 0.3))
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  
  return canvas
}

// Créer une texture THREE.js à partir du canvas
export const createPlanetTexture = (type, size = 1024) => {
  const canvas = generatePlanetTexture(type, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// Composant Hook pour générer les textures
export const usePlanetTexture = (type) => {
  return useMemo(() => createPlanetTexture(type), [type])
}

export default { usePlanetTexture, generatePlanetTexture, createPlanetTexture } 