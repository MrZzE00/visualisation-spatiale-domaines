# Visualisation Spatiale des Domaines Agile

Une application web interactive pour visualiser et explorer les domaines et sous-domaines de la méthodologie agile en 3D.

## 🚀 Technologies Utilisées

- **React** - Framework JavaScript pour l'interface utilisateur
- **Three.js** - Bibliothèque JavaScript pour la visualisation 3D
- **Framer Motion** - Bibliothèque pour les animations
- **Tailwind CSS** - Framework CSS pour le style
- **Vite** - Outil de build et serveur de développement

## 📁 Structure du Projet

```
src/
├── components/           # Composants React
│   ├── SpaceScene.jsx   # Scène 3D principale
│   ├── DomainInfo.jsx   # Panneau d'information des domaines
│   ├── Navigation.jsx   # Navigation et recherche
│   ├── EditableText.jsx # Composant d'édition de texte
│   └── Connection.jsx   # Gestion des connexions entre domaines
├── data/                # Données et logique métier
│   └── domains.js       # Structure des domaines et leurs relations
├── styles/             # Styles CSS
│   └── index.css       # Styles globaux
├── App.jsx             # Composant racine
└── main.jsx           # Point d'entrée de l'application
```

## 🎯 Fonctionnalités

### Visualisation 3D
- Représentation des domaines sous forme de sphères 3D
- Système de caméra orbitale pour la navigation
- Effets visuels (lueur, anneaux, textures)
- Mode performance pour les appareils moins puissants

### Interaction
- Sélection et focus sur les domaines
- Navigation fluide dans l'espace 3D
- Système de recherche de domaines
- Édition en direct des noms et descriptions

### Interface Utilisateur
- Panneau d'information détaillé
- Navigation par onglets (Description, Connexions, Sous-domaines)
- Affichage des relations entre domaines
- Mode sombre optimisé

## 🔧 Configuration Technique

### Dépendances Principales
```json
{
  "dependencies": {
    "react": "^18.x",
    "three": "^0.16.x",
    "framer-motion": "^10.x",
    "tailwindcss": "^3.x"
  }
}
```

### Structure des Données
Les domaines sont définis dans `domains.js` avec la structure suivante :
```javascript
{
  id: string,
  name: string,
  description: string,
  type: string,
  position: [x, y, z],
  color: string,
  size: number,
  links: Array<{id: string, name: string, verb: string}>,
  subDomains: string[],
  detailedInfo: Array<{title: string, description: string}>,
  textures: {
    surface: string,
    atmosphere: string,
    color: string
  }
}
```

## 🚀 Déploiement

Le projet est déployé sur GitHub Pages. Le processus de déploiement utilise :
- `gh-pages` pour le déploiement automatique
- `.nojekyll` pour désactiver le traitement Jekyll
- Script de build Vite pour la production

### Commandes de Déploiement
```bash
# Build du projet
npm run build

# Déploiement sur GitHub Pages
npx gh-pages -d dist
```

## 🛠️ Développement

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts Disponibles
- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run preview` - Prévisualise la version de production
- `npm run deploy` - Déploie sur GitHub Pages

## 📱 Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Support mobile avec interactions tactiles
- Mode performance pour les appareils moins puissants
- Responsive design pour différentes tailles d'écran

## 🔒 Sécurité

### Politique de Sécurité
- Pas de stockage de données sensibles
- Pas d'authentification requise
- Pas de connexion à des API externes
- Pas d'exposition de code source sensible
- Pas de configuration serveur exposée

### Signalement de Vulnérabilités
Pour signaler une vulnérabilité de sécurité, veuillez :
1. Ne pas créer d'issue publique
2. Contacter directement les mainteneurs du projet
3. Fournir une description détaillée du problème
4. Attendre la confirmation de réception

## 📈 Performance

- Optimisation des rendus 3D
- Lazy loading des composants
- Mode performance pour les appareils moins puissants
- Optimisation des assets

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 