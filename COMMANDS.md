# 🔧 Commandes utiles

## 📝 Développement local

```bash
# Démarrer frontend + backend
npm run dev:full

# Démarrer backend uniquement
npm run backend

# Démarrer frontend uniquement
npm run dev

# Démarrer serveur en production
cd backend && npm start

# Initialiser la base de données
cd backend && npm run init

# Linter le code
npm run lint

# Build production
npm run build
```

## 🚀 Déploiement

```bash
# Déployer avec script
./deploy.sh

# Ou manuellement
git add .
git commit -m "Deploy"
git push origin main

# Redéployer Netlify
netlify deploy --prod

# Voir les logs Netlify
netlify logs

# Voir les logs de la build Netlify
netlify build
```

## 🧪 Tests API

```bash
# Lister les départements
curl http://localhost:3001/api/departements

# Lister les zones
curl http://localhost:3001/api/zones/dept-meubles

# Lister les colis
curl http://localhost:3001/api/colis/dept-meubles

# Ajouter un département
curl -X POST http://localhost:3001/api/departements \
  -H "Content-Type: application/json" \
  -d '{"nom": "Électronique"}'

# Ajouter une zone
curl -X POST http://localhost:3001/api/zones \
  -H "Content-Type: application/json" \
  -d '{"departementId": "dept-meubles", "zone": "D"}'

# Ajouter un colis
curl -X POST http://localhost:3001/api/colis \
  -H "Content-Type: application/json" \
  -d '{
    "departementId": "dept-meubles",
    "titre": "Table",
    "zone": "A",
    "position": "A-5-2",
    "description": "Table en bois"
  }'

# Vérifier le PIN
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234"}'

# Produire en JSON formaté
curl -s http://localhost:3001/api/departements | jq .
```

## 📊 MongoDB

```bash
# Connexion directe (si Atlas en ligne)
# Utiliser MongoDB Compass avec: mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net

# Depuis Node.js
node
> const mongoose = require('mongoose')
> mongoose.connect('mongodb+srv://gnadjar:...')
```

## 🔄 Git

```bash
# Créer une nouvelle branche
git checkout -b feature/ma-feature

# Voir les changements
git status
git diff

# Valider les changements
git add .
git commit -m "Description du changement"

# Pousser
git push origin feature/ma-feature

# Créer une pull request sur GitHub

# Fusionner avec main
git checkout main
git pull
git merge feature/ma-feature
git push
```

## 🐛 Débogage

```bash
# Activer les logs MongoDB
MONGODB_DEBUG=true npm run backend

# Voir les requêtes HTTP
# Frontend: F12 → Network tab

# Voir les erreurs
# Frontend: F12 → Console tab
# Backend: Regarder le terminal

# Vérifier les ports utilisés
lsof -i :3001   # Backend
lsof -i :5173   # Frontend
```

## 📦 npm

```bash
# Installer les dépendances
npm install

# Mettre à jour les packages
npm update

# Voir les packages obsolètes
npm outdated

# Supprimer node_modules
rm -rf node_modules
npm install

# Nettoyer le cache npm
npm cache clean --force
```

## 🔐 Secrets

```bash
# Vérifier que les secrets ne sont pas committes
git log -p | grep -i "mongodb_uri"
git log -p | grep -i "pin"

# Si un secret a été commité:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force
```

## 📱 Responsive testing

```bash
# Frontend: F12 → Toggle device toolbar
# Ou: Cmd+Shift+M (Mac)

# Tester sur mobile réel:
# Trouver l'IP locale: ifconfig | grep inet
# Accéder à http://IP:5173
```

## ✅ Pré-commit checklist

Avant de push, exécuter:

```bash
npm run lint           # Vérifier le code
npm run build          # Tester la build
curl http://localhost:3001/api/departements  # Vérifier l'API
```

---

## 📚 Ressources

- [React docs](https://react.dev)
- [Express docs](https://expressjs.com)
- [MongoDB docs](https://docs.mongodb.com)
- [Netlify docs](https://docs.netlify.com)
- [Railway docs](https://docs.railway.app)
