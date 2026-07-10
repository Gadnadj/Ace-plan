# 🚀 Guide de Déploiement Complet

## Architecture de Déploiement

- **Frontend**: Netlify (React/Vite)
- **Backend API**: Railway.app (Node.js/Express)
- **Base de données**: MongoDB Atlas (déjà configurée)

---

## 📋 Prérequis

1. Compte GitHub (ou GitLab)
2. Compte [Netlify](https://netlify.com) (gratuit)
3. Compte [Railway](https://railway.app) (gratuit avec $5/mois crédits)
4. MongoDB Atlas (déjà configurée)

---

## 🎯 Étape 1: Préparer le code pour Git

```bash
# Initialiser git si ce n'est pas fait
cd /Users/gadnadjar/Documents/Dan/Plan
git init
git add .
git commit -m "Initial commit - App with backend"

# Ajouter remote (remplacer par votre repo)
git remote add origin https://github.com/YOUR_USERNAME/plan.git
git branch -M main
git push -u origin main
```

---

## 🌐 Étape 2: Déployer le Frontend sur Netlify

### Méthode 1: Via Netlify CLI (recommandé)

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Connectez-vous
netlify login

# Déployer
netlify deploy --prod
```

### Méthode 2: Via interface web

1. Aller sur [netlify.com](https://netlify.com)
2. Cliquer "New site from Git"
3. Sélectionner GitHub/GitLab et autoriser
4. Sélectionner votre repo
5. Configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Cliquer "Deploy site"

### Configuration des variables d'environnement Netlify

1. Dans Netlify Dashboard → **Site settings** → **Build & deploy** → **Environment**
2. Ajouter:
   ```
   VITE_API_URL = https://ace-plan-production.up.railway.app
   ```

---

## 🚂 Étape 3: Déployer le Backend sur Railway

### 1. Créer un compte Railway

- Aller sur [railway.app](https://railway.app)
- S'enregistrer avec GitHub (plus facile)

### 2. Créer un nouveau projet

1. Cliquer "New Project"
2. Sélectionner "Deploy from GitHub"
3. Autoriser Railway à accéder à votre repo
4. Sélectionner votre repo "plan"
5. Sélectionner le dossier `backend`

### 3. Ajouter les 3 variables d'environnement

**IMPORTANT - Railway Dashboard → Variables → Ajouter ces 3 lignes exactement:**

```
MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
PIN_GESTION=2122
NODE_ENV=production
```

**Note**: Le PORT est attribué automatiquement par Railway, pas besoin de l'ajouter.

### 4. Générer le domaine public

Railway génère automatiquement une URL comme:
`https://ace-plan-production.up.railway.app`

Copier cette URL pour la prochaine étape.

---

## 🔗 Étape 5: Mettre à jour l'URL du Frontend

Maintenant que le backend est déployé:

1. Dans Netlify Dashboard → **Site settings** → **Build & deploy** → **Environment**
2. Mettre à jour `VITE_API_URL` avec l'URL Railway réelle
3. Redéployer le frontend:
   ```bash
   netlify deploy --prod
   ```

---

## 🧪 Tester le déploiement

### Test du backend

```bash
# Remplacer par votre URL Railway
curl https://ace-plan-production.up.railway.app/api/departements
```

Devrait retourner les départements en JSON.

### Test du frontend

1. Aller sur votre URL Netlify
2. Vérifier que les données se chargent
3. Tester l'ajout/suppression de zones et colis

---

## 🔄 Mise à jour après déploiement

### Frontend (Netlify)

```bash
git add .
git commit -m "Update feature"
git push origin main
# Netlify redéploie automatiquement
```

### Backend (Railway)

```bash
cd backend
git add .
git commit -m "Fix API"
git push origin main
# Railway redéploie automatiquement
```

---

## 🆘 Dépannage

### Erreur CORS

Si vous avez des erreurs CORS, vérifier dans `backend/server.js`:

```javascript
app.use(cors()); // Doit être présent
```

### Backend ne répond pas

```bash
# Vérifier les logs Railway
# Dans Railway Dashboard → Deployments → View logs

# Vérifier les variables MongoDB
echo $MONGODB_URI
```

### Frontend ne se connecte pas à l'API

1. Vérifier `VITE_API_URL` dans Netlify
2. Ouvrir la console du navigateur (F12)
3. Vérifier les erreurs réseau

---

## 💰 Coûts estimés

- **Netlify**: Gratuit (jusqu'à 100GB/mois)
- **Railway**: Gratuit (100$ crédits/mois ≈ 50GB data)
- **MongoDB Atlas**: Gratuit (512MB stockage)

**Total**: ✨ Complètement gratuit

---

## 📊 Commandes utiles

```bash
# Local
npm run dev:full        # Frontend + Backend

# Déploiement
netlify deploy --prod   # Frontend
# Backend redéploie auto via Git

# Logs
netlify logs            # Frontend logs
# Railway: Dashboard → Deployments → Logs
```

---

## ✅ Checklist de déploiement

- [ ] Code commité sur GitHub
- [ ] Netlify connecté au repo
- [ ] Build réussit sur Netlify (dist/)
- [ ] Railway connecté au repo
- [ ] Variables d'environnement configurées
- [ ] MongoDB URI configurée
- [ ] Frontend peut atteindre backend API
- [ ] Données chargent correctement

---

## 🎉 C'est prêt!

Une fois déployé, votre application sera accessible 24/7 avec:

- Frontend sur `https://votre-app.netlify.app`
- Backend sur `https://ace-plan-production.up.railway.app`
- Database sur MongoDB Atlas
