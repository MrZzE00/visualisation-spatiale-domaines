import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Version améliorée des étoiles avec shader personnalisé
export const SpaceStars = ({ count = 5000, depth = 100, performanceMode = true }) => {
  const pointsRef = useRef();
  
  // Réduire le nombre de particules en mode performance
  const starCount = performanceMode ? Math.floor(count * 0.7) : count;
  
  // Créer les positions des étoiles
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Positions aléatoires dans une sphère
      const radius = Math.random() * depth;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Couleurs variées pour les étoiles - légèrement teintées
      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        // Étoiles rougeâtres (5%)
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 0.7 + Math.random() * 0.3;
      } else if (colorChoice > 0.90) {
        // Étoiles bleuâtres (5%)
        colors[i3] = 0.7 + Math.random() * 0.3;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 1.0;
      } else if (colorChoice > 0.85) {
        // Étoiles jaunâtres (5%)
        colors[i3] = 1.0;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        // Étoiles blanches avec légère variation (85%)
        const shade = 0.8 + Math.random() * 0.2;
        colors[i3] = shade;
        colors[i3 + 1] = shade;
        colors[i3 + 2] = shade;
      }
      
      // Variation de taille - plus réaliste
      sizes[i] = Math.random() * 0.25 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, [starCount, depth]);
  
  // Shader de particule personnalisé
  const starVertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const starFragmentShader = `
    varying vec3 vColor;
    void main() {
      // Créer un effet de halo avec dégradé radial
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float fade = smoothstep(0.5, 0.0, dist);
      
      // Ajouter un éclat central plus intense
      float glow = smoothstep(0.2, 0.0, dist) * 0.6;
      
      if (fade < 0.01) discard; // Eviter les artefacts de pixels
      
      gl_FragColor = vec4(vColor * (fade + glow), fade);
    }
  `;
  
  // Matériau de shader personnalisé
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);
  
  // Animation simple des étoiles
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute 
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute 
          attach="attributes-size"
          count={starCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
};

// Version simplifiée - suppression des nébuleuses qui peuvent causer des problèmes
export const SpaceNebula = () => {
  // Version simplifiée - ne rien rendre
  return null;
};

// Version simplifiée - suppression des lumières distantes qui peuvent causer des problèmes
export const DistantLights = () => {
  // Version simplifiée - ne rien rendre
  return null;
};

// Composant principal simplifié
export const SpaceBackground = ({ performanceMode = true }) => {
  return (
    <group>
      <SpaceStars count={performanceMode ? 4000 : 7000} performanceMode={performanceMode} />
      {/* Ne plus rendre les nébuleuses et lumières distantes */}
    </group>
  );
}; 