#!/bin/bash
set -e

# Création des fichiers .nojekyll
touch .nojekyll
touch public/.nojekyll

# Construction de l'application
echo "🏗️ Construction de l'application..."
npm run build

# Créer .nojekyll dans le dossier dist
touch dist/.nojekyll

# Déploiement sur GitHub Pages
echo "🚀 Déploiement sur GitHub Pages..."
npx gh-pages -d dist

echo "✅ Déploiement terminé avec succès!"
echo "📝 Votre site sera bientôt accessible à l'adresse:"
echo "🌎 https://mrzze00.github.io/visualisation-spatiale-domaines/"
echo "⏱️ Attendez quelques minutes pour que GitHub Pages mette à jour votre site." 