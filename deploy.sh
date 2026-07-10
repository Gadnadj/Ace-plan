#!/bin/bash

# Script de déploiement complet

echo "🚀 Déploiement de l'application..."

# Vérifier Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Git n'est pas initialisé"
  echo "Exécutez d'abord:"
  echo "  git init"
  echo "  git remote add origin <your-repo-url>"
  exit 1
fi

# Commit et push
echo "📝 Committing changes..."
git add .
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"

echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushé!"
echo ""
echo "🌐 Frontend: https://votre-app.netlify.app"
echo "   - Netlify redéploie automatiquement"
echo ""
echo "🚂 Backend: https://plan-backend.up.railway.app"
echo "   - Railway redéploie automatiquement"
echo ""
echo "⏳ Attendez 2-3 minutes pour que les builds se terminent"
echo ""
echo "Vérifier les logs:"
echo "  Frontend: netlify logs"
echo "  Backend: Railway Dashboard → Deployments"
