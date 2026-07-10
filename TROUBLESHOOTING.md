# 🆘 Troubleshooting Guide

## Frontend

### `port 5173 already in use`

**Symptôme**: `Error: Port 5173 is already in use`

**Solutions**:

```bash
# Vite essayera automatiquement 5174, 5175, etc.
# Ou tuer le process:
lsof -i :5173
kill -9 <PID>

# Ou utiliser un autre port:
npm run dev -- --port 3000
```

---

### Build échoue sur Netlify

**Symptôme**: Erreur au déploiement Netlify

**Solutions**:

1. Vérifier localement:

```bash
npm run build
```

2. Vérifier netlify.toml:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

3. Vérifier les variables d'env:

- Netlify Dashboard → Build & deploy → Environment
- Ajouter `VITE_API_URL`

4. Vérifier node_modules:

```bash
npm ci  # Au lieu de npm install (plus propre)
```

---

### Frontend ne se connecte pas au backend

**Symptôme**: Console (F12) → erreur `Failed to fetch` ou `404`

**Solutions**:

1. Vérifier l'URL API:

```bash
# Console navigateur
console.log(import.meta.env.VITE_API_URL)
```

2. Vérifier que le backend est accessible:

```bash
curl https://ace-plan-production.up.railway.app/api/departements
```

3. Vérifier les variables Netlify:

```bash
netlify env:list
```

4. Vérifier CORS dans backend:

```javascript
// backend/server.js
app.use(cors()); // Doit être avant les routes!
```

---

## Backend

### `MongoDB connection timeout`

**Symptôme**: `MongooseError: connect timeout`

**Solutions**:

1. Vérifier MongoDB Atlas est accessible:
   - Aller sur mongodb.com/cloud
   - Vérifier que l'instance est en ligne

2. Vérifier l'URI MongoDB:

```bash
echo $MONGODB_URI
# Doit ressembler à:
# mongodb+srv://user:pass@cluster.mongodb.net/?appName=App
```

3. Vérifier l'IP est whitelistée:
   - MongoDB Atlas → Network Access
   - Ajouter 0.0.0.0/0 (accès depuis partout)

4. Vérifier la connexion localement:

```bash
node
> const mongoose = require('mongoose')
> mongoose.connect(process.env.MONGODB_URI)
```

---

### `Port 3001 already in use`

**Symptôme**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solutions**:

```bash
# Tuer le process
lsof -i :3001
kill -9 <PID>

# Ou utiliser un autre port
PORT=3002 npm run backend
```

---

### API retourne 404 ou erreur

**Symptôme**: `curl: (52) Empty reply from server` ou `404 Not Found`

**Solutions**:

1. Vérifier que le serveur tourne:

```bash
curl http://localhost:3001
# Devrait retourner quelque chose (pas de 404 sur root)
```

2. Vérifier la route:

```bash
curl http://localhost:3001/api/departements
# Doit retourner un JSON (même vide)
```

3. Vérifier les logs:

```bash
npm run backend
# Regarder la sortie console
```

4. Vérifier que CORS est activé:

```bash
# Dans server.js
app.use(cors())
```

---

### MongoDB vide après déploiement

**Symptôme**: Les données de test ne sont pas visibles

**Solutions**:

1. Initialiser la base sur Railway:
   - Railway Dashboard → Variables
   - Ajouter un script de démarrage:

   ```bash
   npm run init && npm start
   ```

2. Ou directement via MongoDB Atlas:
   - Importer les données manuellement

3. Vérifier que init-db.js est correct:

```bash
npm run init
# Devrait afficher les logs de création
```

---

## Déploiement

### Build réussit localement mais échoue sur Netlify

**Symptôme**: `npm run build` fonctionne mais `Deploy failed`

**Solutions**:

1. Vérifier le node version:

```bash
node --version  # Doit être 18+

# Netlify: Build & deploy → Environment
# Ajouter: NODE_VERSION = 18
```

2. Vérifier package.json:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

3. Vérifier que tous les fichiers sont committes:

```bash
git status
git add .
git commit -m "Fix build"
git push
```

---

### Railway ne se redéploie pas

**Symptôme**: Code pushé mais Railway n'a pas mis à jour

**Solutions**:

1. Vérifier la connexion GitHub:
   - Railway Dashboard → Deployments
   - Vérifier que le repo est connecté

2. Forcer un redéploiement:
   - Railway Dashboard → Deployments → Redeploy

3. Vérifier les logs:
   - Railway Dashboard → Deployments → View Logs

4. Vérifier le Procfile:

```bash
cat backend/Procfile
# Doit contenir: web: npm start
```

---

### Erreur CORS en production

**Symptôme**: `Cross-Origin Request Blocked`

**Solutions**:

1. Ajouter CORS au backend:

```javascript
// backend/server.js (avant les routes)
import cors from 'cors';
app.use(cors());
```

2. Déployer le backend:

```bash
git push  # Railway se redéploie automatiquement
```

3. Attendre quelques minutes et rafraîchir

---

## Données

### Les colis ne s'affichent pas

**Symptôme**: Page blanche ou liste vide même avec données

**Solutions**:

1. Vérifier la console (F12) pour les erreurs

2. Initialiser les données:

```bash
cd backend && npm run init
```

3. Vérifier le département actif:
   - Frontend devrait sélectionner le premier département

4. Vérifier l'API:

```bash
curl http://localhost:3001/api/colis/dept-meubles
```

---

### Erreur lors de l'ajout d'un colis

**Symptôme**: "Zone requise" ou erreur lors de la soumission

**Solutions**:

1. Vérifier que les zones existent:

```bash
curl http://localhost:3001/api/zones/dept-meubles
```

2. Créer une zone si besoin:

```bash
curl -X POST http://localhost:3001/api/zones \
  -H "Content-Type: application/json" \
  -d '{"departementId": "dept-meubles", "zone": "A"}'
```

3. Vérifier les logs frontend (F12 → Console)

---

## Authentification

### PIN ne fonctionne pas

**Symptôme**: Mode Gestion ne s'active pas

**Solutions**:

1. Vérifier le PIN:
   - Par défaut: `1234`

2. Vérifier la variable d'env:

```bash
echo $PIN_GESTION
# Doit afficher 1234 (ou votre PIN)
```

3. Vérifier l'API:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pin": "1234"}'
```

---

## Performance

### Application lente

**Solutions**:

1. Vérifier la bande passante réseau (F12 → Network)

2. Vérifier la latence MongoDB:

```bash
# Dans MongoDB Atlas
# Metrics → Network → Latency
```

3. Optimiser les requêtes:
   - Ajouter des indexes
   - Limiter les données retournées

4. Vérifier les logs serveur:

```bash
npm run backend
# Regarder les temps de réponse
```

---

## Logs & Debugging

### Voir les logs Netlify

```bash
netlify logs
# Ou directement dans le dashboard
```

### Voir les logs Railway

- Dashboard → Deployments → View Logs
- Ou: Dashboard → Monitoring

### Voir les logs locaux

```bash
# Frontend
npm run dev
# Regarder la sortie console

# Backend
npm run backend
# Regarder les logs MongoDB et les requêtes HTTP
```

---

## ✅ Vérifier tout

**Checklist de diagnostic:**

```bash
# 1. Serveur local
npm run dev:full

# 2. Connexion API
curl http://localhost:3001/api/departements

# 3. Données
curl http://localhost:3001/api/colis/dept-meubles

# 4. Frontend
# Ouvrir http://localhost:5173 et vérifier F12

# 5. Build
npm run build

# 6. Linter
npm run lint
```

---

## 📞 Aide supplémentaire

Si rien ne fonctionne:

1. Vérifier les logs (terminal et F12)
2. Vérifier les variables d'env
3. Vérifier que les services sont en ligne
4. Redémarrer (turnoff/on)

```bash
# Redémarrage complet
rm -rf node_modules
npm install
cd backend && npm install && cd ..
npm run dev:full
```
