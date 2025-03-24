import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Line, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { allDomains, getLinkedDomains, getChildDomains, getDomainById, getAllRelatedDomains, updateDomainData } from '../data/domains'
import { SpaceBackground } from './SpaceBackground'

// Composant d'édition de texte
const EditableText = ({ text, onTextChange, isEditing, setIsEditing, textType, fontSize = 'text-xs' }) => {
  const [editedText, setEditedText] = useState(text)
  const inputRef = useRef(null)
  
  // Focus sur l'input quand on entre en mode édition
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])
  
  // Gestion des touches spéciales
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onTextChange(editedText)
      setIsEditing(false)
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setEditedText(text) // Restaurer le texte original
      setIsEditing(false)
      e.preventDefault()
    }
  }
  
  const handleClickOutside = () => {
    if (isEditing) {
      onTextChange(editedText)
      setIsEditing(false)
    }
  }
  
  return (
    <div 
      className={`relative ${isEditing ? 'z-50' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleClickOutside}
          className={`bg-gray-800 text-white px-2 py-0.5 rounded-md border border-blue-400 outline-none ${fontSize}`}
          style={{ minWidth: textType === 'domain' ? '100px' : '60px' }}
          autoFocus
        />
      ) : (
        <span 
          className="cursor-pointer"
          onClick={() => setIsEditing(true)}
          title="Cliquez pour modifier"
        >
          {text}
        </span>
      )}
    </div>
  )
}

// Planète représentant un domaine avec texture réaliste
const DomainPlanet = ({ domain, onDomainClick, active, hoveredDomain, performanceMode, onDomainNameChange }) => {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const isHovered = hovered || (hoveredDomain && hoveredDomain.id === domain.id)
  const isActive = active && active.id === domain.id
  
  // Récupérer la couleur du domaine avec une fallback
  const color = domain.color || '#f0a83a'
  // Taille basée sur l'importance du domaine
  const size = domain.parentId ? (domain.size || 0.5) * 0.5 : domain.size || 1
  
  // Segments réduits en mode performance
  const segments = performanceMode ? 16 : 32
  
  // Gestion du changement de nom du domaine
  const handleNameChange = (newName) => {
    if (newName !== domain.name) {
      onDomainNameChange(domain.id, newName)
    }
  }
  
  // Animation de survol
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: isHovered ? 1.05 : 1,
        y: isHovered ? 1.05 : 1,
        z: isHovered ? 1.05 : 1,
        duration: 0.3
      })
    }
  }, [isHovered])
  
  // Rotation lente de la planète
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <group 
      ref={groupRef}
      position={domain.position || [0, 0, 0]}
    >
      {/* Sphère représentant la planète */}
      <mesh
        ref={meshRef}
        onClick={() => {
          if (!isEditing) {
            onDomainClick(domain)
          }
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          // Empêcher le comportement par défaut du navigateur sur mobile
          e.stopPropagation()
        }}
        onPointerUp={(e) => {
          // Empêcher le comportement par défaut du navigateur sur mobile
          e.stopPropagation()
        }}
        onTouchStart={(e) => {
          // Empêcher le comportement par défaut du navigateur sur mobile
          e.stopPropagation()
        }}
        onTouchEnd={(e) => {
          // Empêcher le comportement par défaut du navigateur sur mobile
          e.stopPropagation()
        }}
        receiveShadow={!performanceMode}
        castShadow={!performanceMode}
      >
        <sphereGeometry args={[size, segments, segments]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.7} 
          emissive={isHovered ? color : '#000000'} 
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>
      
      {/* Anneau autour de la planète pour les domaines principaux */}
      {domain.type?.includes('Principal') && (
        <mesh 
          rotation={[Math.PI / 3, 0, 0]}
        >
          <ringGeometry args={[size * 1.8, size * 2.1, performanceMode ? 32 : 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Bulle de message au-dessus de la planète pour une meilleure lisibilité */}
      <Html
        position={[0, size * 2.6, 0]}
        center
        className="pointer-events-auto"
        transform
        occlude={false}
        distanceFactor={10}
        sprite
      >
        <div className={`
          px-2 py-1
          bg-gray-800/90
          text-white
          text-center
          font-medium
          shadow-lg
          rounded-md
          whitespace-nowrap
          transition-all duration-300
          text-xs sm:text-sm
          max-w-[120px] sm:max-w-[150px]
          ${isHovered || isActive ? 'scale-110' : ''}
        `}
        style={{
          textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
          minWidth: "60px",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: isHovered || isActive ? "#ffffff" : color
        }}
        >
          <EditableText 
            text={domain.name} 
            onTextChange={handleNameChange} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing}
            textType="domain"
          />
          {/* Petit triangle en bas de la bulle */}
          <div 
            className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-800/90 border-b border-r border-gray-500"
            style={{
              boxSizing: "content-box",
              transform: "translate(-50%, 0) rotate(45deg)"
            }}
          />
        </div>
      </Html>
      
      {/* Étiquette du domaine (maintenue pour compatibilité) mais cachée */}
      <Html
        position={[0, size * 1.8, 0]}
        center
        distanceFactor={15}
        occlude={[meshRef]}
        className="opacity-0 pointer-events-none"
      >
        <div className="hidden">
          {domain.name}
        </div>
      </Html>
    </group>
  )
}

// Composant de connexion entre deux domaines
const DomainConnection = ({ source, target, verb, active, hoveredDomain, highlight, onVerbChange }) => {
  const startRef = useRef()
  const endRef = useRef()
  const [isEditing, setIsEditing] = useState(false)
  const points = useMemo(() => {
    const start = new THREE.Vector3(...source.position)
    const end = new THREE.Vector3(...target.position)
    
    // Calculer un point intermédiaire pour créer une courbe
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    
    // Ajouter une légère courbe pour éviter les lignes droites
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5 + 2,
      (Math.random() - 0.5) * 5
    )
    mid.add(offset)
    
    // Générer plus de points pour une courbe fluide
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    return curve.getPoints(10)
  }, [source.position, target.position])
  
  // Déterminer si cette connexion est en surbrillance
  const isHighlighted = 
    highlight || 
    (active && (active.id === source.id || active.id === target.id)) ||
    (hoveredDomain && (hoveredDomain.id === source.id || hoveredDomain.id === target.id))
  
  // Définir la couleur de la connexion
  const lineColor = useMemo(() => {
    if (isHighlighted) return new THREE.Color('#ffffff')
    
    // Mélange des couleurs des domaines source et cible
    const sourceColor = new THREE.Color(source.color || '#f0a83a')
    const targetColor = new THREE.Color(target.color || '#f0a83a')
    return sourceColor.lerp(targetColor, 0.5)
  }, [isHighlighted, source.color, target.color])
  
  // Animation des connexions
  useEffect(() => {
    if (startRef.current && endRef.current) {
      gsap.to(startRef.current.scale, {
        x: isHighlighted ? 1.5 : 1,
        y: isHighlighted ? 1.5 : 1,
        z: isHighlighted ? 1.5 : 1,
        duration: 0.3
      })
      gsap.to(endRef.current.scale, {
        x: isHighlighted ? 1.5 : 1,
        y: isHighlighted ? 1.5 : 1,
        z: isHighlighted ? 1.5 : 1,
        duration: 0.3
      })
    }
  }, [isHighlighted])
  
  // Gestion du changement du verbe de connexion
  const handleVerbChange = (newVerb) => {
    if (newVerb !== verb) {
      onVerbChange(source.id, target.id, newVerb)
    }
  }
  
  return (
    <group>
      {/* Ligne reliant les domaines */}
      <Line
        points={points}
        color={lineColor}
        lineWidth={isHighlighted ? 3 : 1.5}
        opacity={isHighlighted ? 1 : 0.7}
        transparent
        dashed={false}
      />
      
      {/* Points aux extrémités de la connexion */}
      <mesh 
        ref={startRef}
        position={points[0]} 
        scale={[1, 1, 1]}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={lineColor} />
      </mesh>
      <mesh 
        ref={endRef}
        position={points[points.length - 1]} 
        scale={[1, 1, 1]}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={lineColor} />
      </mesh>
      
      {/* Étiquette de la relation */}
      {(isHighlighted || isEditing) && (
        <Html
          position={points[Math.floor(points.length / 2)]}
          center
          distanceFactor={15}
          sprite
          occlude={false}
          className="pointer-events-auto"
        >
          <div className="px-2 py-0.5 bg-gray-900/90 text-white text-xs rounded-md whitespace-nowrap border border-gray-500"
            style={{
              textShadow: "0px 1px 2px rgba(0,0,0,1)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.5)"
            }}
          >
            <EditableText 
              text={verb || 'connecté à'} 
              onTextChange={handleVerbChange} 
              isEditing={isEditing} 
              setIsEditing={setIsEditing}
              textType="verb"
            />
          </div>
        </Html>
      )}
    </group>
  )
}

// Composant principal de la scène
const SpaceScene = ({ onDomainClick, activeDomain, hoveredDomain, performanceMode, onDataChange }) => {
  const { camera } = useThree()
  const [isZoomedOut, setIsZoomedOut] = useState(false)
  const cameraRef = useRef(camera)
  const initialCameraPositionRef = useRef(null)
  const zoomedOutDomainsRef = useRef([])
  
  // Sauvegarder la position initiale de la caméra
  useEffect(() => {
    if (camera && !initialCameraPositionRef.current) {
      initialCameraPositionRef.current = camera.position.clone()
    }
    cameraRef.current = camera
  }, [camera])
  
  // Filtrer les domaines pour n'afficher que les principaux ou les subdomaines en fonction du domaine actif
  const visibleDomains = useMemo(() => {
    // Si on est en mode zoom out, afficher tous les domaines liés
    if (isZoomedOut && activeDomain) {
      return zoomedOutDomainsRef.current
    }
    
    // Si un domaine est actif
    if (activeDomain) {
      // Afficher ses enfants et le domaine actif
      const children = getChildDomains(activeDomain.id)
      const linked = getLinkedDomains(activeDomain.id)
      
      // Toujours afficher le domaine actif, ses enfants et ses domaines liés
      return [activeDomain, ...children, ...linked]
    }
    
    // Par défaut, afficher tous les domaines principaux et leurs satellites directs
    const mainDomains = allDomains.filter(d => d.type?.includes('Principal'))
    const satellites = []
    
    // Ajouter les satellites (sous-domaines) pour chaque domaine principal
    mainDomains.forEach(domain => {
      const children = getChildDomains(domain.id)
      satellites.push(...children)
    })
    
    return [...mainDomains, ...satellites]
  }, [activeDomain, isZoomedOut])
  
  // Calculer les connexions entre les domaines visibles
  const visibleConnections = useMemo(() => {
    const connections = []
    
    visibleDomains.forEach(source => {
      if (source.links) {
        source.links.forEach(link => {
          const target = getDomainById(link.id)
          if (target && visibleDomains.some(d => d.id === target.id)) {
            connections.push({
              source,
              target,
              verb: link.verb || ''
            })
          }
        })
      }
    })
    
    return connections
  }, [visibleDomains])
  
  // Gestionnaire de changement de nom de domaine
  const handleDomainNameChange = (domainId, newName) => {
    if (onDataChange) {
      onDataChange({ 
        type: 'updateDomainName', 
        domainId, 
        newName 
      })
    }
  }
  
  // Gestionnaire de changement de verbe
  const handleVerbChange = (sourceId, targetId, newVerb) => {
    if (onDataChange) {
      onDataChange({ 
        type: 'updateVerb', 
        sourceId, 
        targetId, 
        newVerb 
      })
    }
  }
  
  // Fonction pour gérer le zoom out
  const handleZoomOut = (domain) => {
    if (!domain) return
    
    // Récupérer tous les domaines liés
    const allRelatedDomains = getAllRelatedDomains(domain.id)
    zoomedOutDomainsRef.current = allRelatedDomains
    
    // Activer le mode zoom out
    setIsZoomedOut(true)
    
    // Calculer le centre de tous les domaines
    const center = new THREE.Vector3(0, 0, 0)
    let maxDistance = 0
    
    allRelatedDomains.forEach(d => {
      const position = new THREE.Vector3(...d.position)
      center.add(position)
    })
    
    center.divideScalar(allRelatedDomains.length)
    
    // Calculer la distance maximale du centre
    allRelatedDomains.forEach(d => {
      const position = new THREE.Vector3(...d.position)
      const distance = position.distanceTo(center)
      if (distance > maxDistance) {
        maxDistance = distance
      }
    })
    
    // Calculer la nouvelle position de la caméra
    const cameraDirection = new THREE.Vector3(0, 0, 1)
    const distance = Math.max(50, maxDistance * 2.5) // Assurer un recul suffisant
    const newPosition = center.clone().add(cameraDirection.multiplyScalar(distance))
    
    // Animer la caméra vers la nouvelle position
    gsap.to(camera.position, {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      duration: 2,
      ease: "power3.inOut",
      onComplete: () => {
        // Notifier que le zoom out est terminé
        onDomainClick(domain, true)
      }
    })
    
    // Orienter la caméra vers le centre
    gsap.to(camera.lookAt, {
      x: center.x,
      y: center.y,
      z: center.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(center)
      }
    })
  }
  
  // Gestion du clic sur un domaine
  const handleDomainClick = useCallback((domain) => {
    if (onDomainClick) {
      if (domain.id === activeDomain?.id) {
        // Si on clique sur le domaine déjà actif, on passe en vue étendue
        handleZoomOut(domain)
      } else {
        onDomainClick(domain)
      }
    }
  }, [onDomainClick, activeDomain])
  
  // Réinitialiser la position de la caméra lorsque l'on quitte le mode zoom out
  useEffect(() => {
    if (!activeDomain && isZoomedOut) {
      setIsZoomedOut(false)
      
      // Revenir à la position initiale
      if (initialCameraPositionRef.current && cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: initialCameraPositionRef.current.x,
          y: initialCameraPositionRef.current.y,
          z: initialCameraPositionRef.current.z,
          duration: 2,
          ease: "power3.inOut"
        })
      }
    }
  }, [activeDomain, isZoomedOut])
  
  return (
    <>
      {/* Fond spatial avancé */}
      <SpaceBackground performanceMode={performanceMode} />
      
      {/* Éclairage ambiant */}
      <ambientLight intensity={0.4} />
      
      {/* Éclairage principal */}
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.8} 
        castShadow={!performanceMode}
      />
      
      {/* Éclairage d'accentuation */}
      <pointLight
        position={[-30, 10, -30]}
        intensity={0.5}
        color="#5599ff"
      />
      
      {/* Domaines (planètes) */}
      {visibleDomains.map(domain => (
        <DomainPlanet
          key={domain.id}
          domain={domain}
          onDomainClick={handleDomainClick}
          active={activeDomain}
          hoveredDomain={hoveredDomain}
          performanceMode={performanceMode}
          onDomainNameChange={handleDomainNameChange}
        />
      ))}
      
      {/* Connexions entre domaines */}
      {visibleConnections.map((connection, index) => (
        <DomainConnection
          key={`${connection.source.id}-${connection.target.id}-${index}`}
          source={connection.source}
          target={connection.target}
          verb={connection.verb}
          active={activeDomain}
          hoveredDomain={hoveredDomain}
          highlight={activeDomain && activeDomain.id === connection.source.id && hoveredDomain && hoveredDomain.id === connection.target.id}
          onVerbChange={handleVerbChange}
        />
      ))}
      
      {/* Indicateur de mode zoom out */}
      {isZoomedOut && (
        <Html position={[0, -20, 0]} center sprite occlude={false}>
          <div className="px-4 py-2 bg-gray-800/90 text-white text-sm rounded-md border border-gray-500 shadow-lg"
            style={{
              textShadow: "0px 1px 2px rgba(0,0,0,1)",
            }}
          >
            Vue étendue des domaines liés
          </div>
        </Html>
      )}
    </>
  )
}

export default SpaceScene 