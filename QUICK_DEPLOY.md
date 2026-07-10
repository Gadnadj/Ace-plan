# 🚀 DÉPLOIEMENT RAPIDE - NETLIFY + RAILWAY

## 5 minutes pour déployer!

### Étape 1: Initialiser Git

```bash
cd /Users/gadnadjar/Documents/Dan/Plan
git init
git add .
git commit -m "Initial commit"
```

### Étape 2: Créer le repo GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. Créer un repo `plan`
3. Copier les commandes:

```bash
git remote add origin https://github.com/YOUR_USERNAME/plan.git
git branch -M main
git push -u origin main
```

### Étape 3: Déployer Frontend sur Netlify (2 min)

1. Aller sur [netlify.com](https://netlify.com)
2. Cliquer "Add new site" → "Import an existing project"
3. Sélectionner GitHub et votre repo `plan`
4. Configuration automatique (détecte Vite)
5. Cliquer "Deploy"

**URL Frontend**: `https://xxx.netlify.app` (copier)

### Étape 4: Déployer Backend sur Railway (2 min)

1. Aller sur [railway.app](https://railway.app)
2. Cliquer "New Project" → "Deploy from GitHub"
3. Sélectionner le repo `plan`
4. Railway détecte `backend/package.json` automatiquement
5. **Ajouter 3 variables d'environnement** (Build & deploy → Environment):

   **IMPORTANT: Copier-coller exactement ceci:**

   ```
   MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
   PIN_GESTION=2122
   NODE_ENV=production
   ```

6. Cliquer "Deploy"
7. Générer domaine public → copier l'URL

**URL Backend**: `https://ace-plan-production.up.railway.app` (copier)

### Étape 5: Connecter Frontend à Backend

1. Netlify Dashboard → **Site settings** → **Build & deploy** → **Environment**
2. Ajouter variable:
   ```
   VITE_API_URL=https://ace-plan-production.up.railway.app
   ```
3. Cliquer **Trigger deploy** pour redéployer

### ✅ C'est prêt!

- Frontend: `https://xxx.netlify.app`
- Backend: `https://ace-plan-production.up.railway.app`
- Database: MongoDB Atlas

---

## 🔄 Mettre à jour après déploiement

```bash
# Faire des changements
nano src/App.jsx

# Commit et push
git add .
git commit -m "Fix bug"
git push

# Netlify + Railway redéploient automatiquement! ✨
```

---

## 🧪 Tester

```bash
# Backend
curl https://ace-plan-production.up.railway.app/api/departements

# Frontend - ouvrir dans le navigateur
https://xxx.netlify.app
```

---

## 📞 Support

- Netlify logs: `netlify logs`
- Railway logs: Dashboard → Deployments → Logs
- Vérifier console navigateur (F12) pour erreurs CORS
