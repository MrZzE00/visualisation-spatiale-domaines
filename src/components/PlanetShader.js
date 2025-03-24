import * as THREE from 'three';

// Shader pour planètes avec atmosphère et effets avancés
export const PlanetShaderMaterial = (options = {}) => {
  const {
    color = new THREE.Color('#ffffff'),
    emissiveColor = new THREE.Color('#111111'),
    cloudColor = new THREE.Color('#ffffff'),
    atmosphereColor = new THREE.Color('#77ccff'),
    noiseScale = 2.0,
    noiseIntensity = 0.5,
    hasAtmosphere = true,
    atmosphereIntensity = 0.3,
    planetType = 'rocky',
    seed = Math.random() * 10000,
    resolution = 256
  } = options;

  // Définir les caractéristiques en fonction du type de planète
  let surfaceSettings = {
    bumpScale: 0.05,
    specularIntensity: 0.5,
    roughness: 0.7,
    detailScale: 8.0
  };

  switch (planetType) {
    case 'rocky':
      surfaceSettings = { 
        bumpScale: 0.08, 
        specularIntensity: 0.4, 
        roughness: 0.8,
        detailScale: 10.0
      };
      break;
    case 'desert':
      surfaceSettings = { 
        bumpScale: 0.04, 
        specularIntensity: 0.7, 
        roughness: 0.6,
        detailScale: 6.0
      };
      break;
    case 'oceanic':
      surfaceSettings = { 
        bumpScale: 0.02, 
        specularIntensity: 0.9, 
        roughness: 0.3,
        detailScale: 4.0
      };
      break;
    case 'volcanic':
      surfaceSettings = { 
        bumpScale: 0.1, 
        specularIntensity: 0.6, 
        roughness: 0.7,
        detailScale: 8.0
      };
      break;
    case 'crystalline':
      surfaceSettings = { 
        bumpScale: 0.06, 
        specularIntensity: 1.0, 
        roughness: 0.2,
        detailScale: 12.0
      };
      break;
    default:
      // Valeurs par défaut déjà définies
  }

  // Fragment shader pour créer une texture de planète avancée
  const fragmentShader = `
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform float uNoiseScale;
    uniform float uNoiseIntensity;
    uniform float uBumpScale;
    uniform float uSpecularIntensity;
    uniform float uRoughness;
    uniform float uDetailScale;
    uniform float uSeed;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    // Fonction de bruit simplex optimisée pour la performance
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
      // Déterminer la cellule du réseau
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
    
      // Calculer la contribution de chaque coin de la cellule
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
    
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
    
      // Permutations
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
      // Gradient: vecteurs médians des sommets des plans d'un icosaèdre
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
      m = m * m;
      m = m * m;
    
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
    
      // Normaliser gradients
      vec3 g0 = vec3(a0.x, h.x, 0.0);
      vec3 g1 = vec3(a0.y, h.y, 0.0);
      vec3 g2 = vec3(a0.z, h.z, 0.0);
      
      // Normaliser
      vec3 g = normalize(vec3(g0.x, g1.y, g2.z));
      
      // Calcul du bruit final
      return 130.0 * dot(m, vec3(dot(x0, g0), dot(x1, g1), dot(x2, g2)));
    }
    
    // Fonction FBM (Fractional Brownian Motion) pour un bruit plus détaillé
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      // Ajouter la graine au vecteur de position pour la randomisation
      p += vec3(uSeed);
      
      for (int i = 0; i < octaves; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
        
        // Limiter le nombre d'octaves pour les performances
        if (i >= 3) break;
      }
      
      return value;
    }
    
    void main() {
      // Coordonnées sphériques pour simuler une texture planétaire
      vec3 spherePos = normalize(vPosition);
      
      // Bruit de base pour la surface
      float noise = fbm(spherePos * uNoiseScale, 4) * uNoiseIntensity;
      
      // Bruit de détail pour les caractéristiques plus fines
      float detail = fbm(spherePos * uDetailScale, 2) * 0.5;
      
      // Combiner les bruits
      float combinedNoise = noise + detail * 0.3;
      
      // Couleur de base modifiée par le bruit
      vec3 baseColor = uColor * (1.0 + combinedNoise * 0.4);
      
      // Simuler des caractéristiques topographiques
      float elevation = smoothstep(-0.2, 0.4, noise);
      
      // Créer des transitions entre différentes zones (terres/océans pour des planètes terrestres)
      vec3 finalColor = mix(
        baseColor * 0.8,
        baseColor * 1.2,
        elevation
      );
      
      // Ajouter des variations de teinte pour plus de réalisme
      float hueVariation = detail * 0.2;
      finalColor *= vec3(1.0 + hueVariation, 1.0, 1.0 - hueVariation);
      
      // Simuler l'éclairage de la surface
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));
      
      // Modifier la normale avec le bruit pour simuler les reliefs
      vec3 bumpedNormal = normal + vec3(noise * uBumpScale);
      bumpedNormal = normalize(bumpedNormal);
      
      // Calcul de l'éclairage basé sur la normale modifiée
      float bumpedDiffuse = max(0.0, dot(bumpedNormal, lightDir));
      
      // Éclat spéculaire pour les zones réfléchissantes
      vec3 viewDir = normalize(-vPosition);
      vec3 halfDir = normalize(lightDir + viewDir);
      float specular = pow(max(0.0, dot(bumpedNormal, halfDir)), 32.0) * (1.0 - uRoughness) * uSpecularIntensity;
      
      // Composante émissive pour simuler la lumière propre (pour les planètes volcaniques ou énergétiques)
      vec3 emissive = uEmissive * smoothstep(0.7, 0.9, noise) * 2.0;
      
      // Illumination finale
      vec3 lighting = vec3(
        (diffuse * 0.7 + bumpedDiffuse * 0.3) * 0.8 + 0.2,  // Diffuse + ambient
        specular,                                            // Specular
        0.0                                                  // Reserved
      );
      
      // Couleur finale avec éclairage et émission
      gl_FragColor = vec4(finalColor * lighting.x + vec3(specular) + emissive, 1.0);
    }
  `;

  // Vertex shader standard avec positionnement pour le fragment shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Créer un matériau avec les shaders personnalisés
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uEmissive: { value: emissiveColor },
      uNoiseScale: { value: noiseScale },
      uNoiseIntensity: { value: noiseIntensity },
      uBumpScale: { value: surfaceSettings.bumpScale },
      uSpecularIntensity: { value: surfaceSettings.specularIntensity },
      uRoughness: { value: surfaceSettings.roughness },
      uDetailScale: { value: surfaceSettings.detailScale },
      uSeed: { value: seed }
    },
    fragmentShader,
    vertexShader,
    lights: true
  });

  return material;
};

// Shader pour l'atmosphère de la planète
export const AtmosphereShaderMaterial = (options = {}) => {
  const {
    color = new THREE.Color('#77ccff'),
    intensity = 0.5,
    size = 1.1,
    falloff = 3.0,
    seed = Math.random() * 10000
  } = options;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uFalloff;
    uniform float uSeed;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Direction de la caméra (l'observateur)
      vec3 viewDir = normalize(-vPosition);
      
      // Effet de diffusion avec la direction de vue
      float intensity = pow(1.0 - abs(dot(viewDir, vNormal)), uFalloff) * uIntensity;
      
      // Ajouter un peu de bruit pour simuler des nuages ou des variations atmosphériques
      vec3 noisePos = vNormal * 2.0 + vec3(uSeed);
      float noise = fract(sin(dot(noisePos, vec3(12.9898, 78.233, 45.164))) * 43758.5453) * 0.2;
      
      // Couleur finale avec diffusion atmosphérique
      vec3 finalColor = uColor * intensity * (1.0 + noise);
      
      // Transparence en fonction de l'angle de vue
      float alpha = intensity * 0.8;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uIntensity: { value: intensity },
      uFalloff: { value: falloff },
      uSeed: { value: seed }
    },
    fragmentShader,
    vertexShader,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return material;
};

// Shader pour les anneaux de planète
export const RingShaderMaterial = (options = {}) => {
  const {
    color = new THREE.Color('#ffffff'),
    innerRadius = 1.8,
    outerRadius = 2.2,
    opacity = 0.7,
    detail = 3.0,
    seed = Math.random() * 10000
  } = options;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    uniform float uOpacity;
    uniform float uDetail;
    uniform float uSeed;
    
    varying vec2 vUv;
    
    // Fonction de bruit simplifié pour les performances
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      // Distance par rapport au centre (coordonnée radiale)
      float dist = length(vUv - 0.5) * 2.0;
      
      // Facteur de distance normalisé entre le rayon interne et externe
      float r = (dist - uInnerRadius) / (uOuterRadius - uInnerRadius);
      
      // Si en dehors de l'anneau, rendre transparent
      if (r < 0.0 || r > 1.0) {
        discard;
      }
      
      // Coordonnées polaires pour créer des variations circulaires
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5) + uSeed;
      
      // Bruit pour créer des variations de densité dans l'anneau
      float density = noise(vec2(angle * 10.0, r * uDetail)) * 0.5 + 0.5;
      
      // Plus dense vers le centre de l'anneau
      float radialFalloff = 1.0 - 4.0 * pow(r - 0.5, 2.0);
      
      // Modulation de la densité
      density *= radialFalloff;
      
      // Ajout de bandes concentriques
      float bands = sin(r * 20.0 + uSeed) * 0.5 + 0.5;
      density *= (0.8 + bands * 0.2);
      
      // Couleur finale
      vec3 finalColor = uColor * density;
      
      // Transparence qui augmente vers les bords
      float alpha = density * uOpacity;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius },
      uOpacity: { value: opacity },
      uDetail: { value: detail },
      uSeed: { value: seed }
    },
    fragmentShader,
    vertexShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  return material;
};

// Gérer les paramètres de shader en fonction du type de planète
export const getPlanetShaderParams = (planetType, color) => {
  let params = {
    color: new THREE.Color(color),
    emissiveColor: new THREE.Color('#000000'),
    noiseScale: 2.0,
    noiseIntensity: 0.5,
    atmosphereColor: new THREE.Color('#77ccff'),
    hasAtmosphere: true,
    atmosphereIntensity: 0.3
  };

  switch (planetType) {
    case 'rocky':
      params.noiseScale = 3.0;
      params.noiseIntensity = 0.8;
      params.atmosphereColor = new THREE.Color('#a0d8ff');
      break;
    case 'desert':
      params.noiseScale = 2.0;
      params.noiseIntensity = 0.6;
      params.atmosphereColor = new THREE.Color('#ffcb8e');
      params.atmosphereIntensity = 0.2;
      break;
    case 'oceanic':
      params.noiseScale = 1.5;
      params.noiseIntensity = 0.4;
      params.atmosphereColor = new THREE.Color('#80d8ff');
      params.atmosphereIntensity = 0.5;
      break;
    case 'volcanic':
      params.noiseScale = 2.5;
      params.noiseIntensity = 0.9;
      params.emissiveColor = new THREE.Color('#ff3300').multiplyScalar(0.2);
      params.atmosphereColor = new THREE.Color('#ff6633');
      params.atmosphereIntensity = 0.4;
      break;
    case 'forested':
      params.noiseScale = 2.2;
      params.noiseIntensity = 0.7;
      params.atmosphereColor = new THREE.Color('#a0ffa0');
      break;
    case 'crystalline':
      params.noiseScale = 4.0;
      params.noiseIntensity = 0.6;
      params.emissiveColor = new THREE.Color('#66ffff').multiplyScalar(0.1);
      params.atmosphereColor = new THREE.Color('#ccffff');
      break;
    case 'grid-like':
      params.noiseScale = 6.0;
      params.noiseIntensity = 0.3;
      params.emissiveColor = new THREE.Color('#22aaff').multiplyScalar(0.1);
      params.atmosphereColor = new THREE.Color('#aaddff');
      break;
    case 'glassy':
      params.noiseScale = 1.0;
      params.noiseIntensity = 0.2;
      params.emissiveColor = new THREE.Color(color).multiplyScalar(0.1);
      params.atmosphereColor = new THREE.Color(color).multiplyScalar(1.2);
      break;
    case 'solid':
      params.noiseScale = 0.5;
      params.noiseIntensity = 0.1;
      params.atmosphereIntensity = 0.1;
      break;
    case 'void-like':
      params.noiseScale = 3.0;
      params.noiseIntensity = 1.0;
      params.emissiveColor = new THREE.Color('#000033').multiplyScalar(0.1);
      params.atmosphereColor = new THREE.Color('#000066');
      params.atmosphereIntensity = 0.6;
      break;
    case 'structured':
      params.noiseScale = 5.0;
      params.noiseIntensity = 0.4;
      params.atmosphereColor = new THREE.Color('#eeeeee');
      break;
    case 'patterned':
      params.noiseScale = 8.0;
      params.noiseIntensity = 0.3;
      params.atmosphereColor = new THREE.Color('#eeeeee');
      break;
  }

  return params;
}; 