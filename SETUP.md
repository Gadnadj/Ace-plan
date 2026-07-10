# Plan - Warehouse Management App

Application de gestion de stock avec frontend React et backend Node.js/Express + MongoDB.

## 🚀 Démarrage rapide

### Installation

```bash
# Frontend
npm install

# Backend (folder backend/)
cd backend && npm install
```

### Démarrage du développement

**Option 1: Lancer les deux serveurs ensemble**

```bash
npm run dev:full
```

**Option 2: Lancer séparément**

Terminal 1 - Backend:

```bash
npm run backend
```

Terminal 2 - Frontend:

```bash
npm run dev
```

### Serveurs

- **Frontend**: http://localhost:5173 (ou 5174+ si le port est occupé)
- **Backend API**: http://localhost:3001

## 📦 Structure

```
/
├── src/                    # Code React
│   ├── components/
│   ├── context/           # Contexts (Auth, Departements, Zones)
│   ├── hooks/             # Custom hooks (useColis)
│   └── config.js          # Configuration API
├── backend/               # Serveur Node.js/Express
│   ├── server.js          # Application Express
│   ├── models.js          # Schémas Mongoose
│   ├── .env               # Variables d'environnement
│   └── README.md
├── package.json
└── vite.config.js
```

## 🔑 Configuration

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
PIN_GESTION=1234
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001
```

## 📊 Base de données

Données stockées dans MongoDB:

- **Departements** - Meubles, Électronique, etc.
- **Zones** - Lettres (A, B, C, P)
- **Colis** - Articles avec localisation

## 🔐 Authentification

- **Mode Consultation**: Accès en lecture seule (défaut)
- **Mode Gestion**: PIN requis (1234)

## 🛠 Scripts npm

- `npm run dev` - Démarrer frontend uniquement
- `npm run backend` - Démarrer backend uniquement
- `npm run dev:full` - Démarrer frontend + backend
- `npm run build` - Build production
- `npm run lint` - Linter le code

## 📝 API Endpoints

Voir [backend/README.md](backend/README.md) pour la documentation complète de l'API.

## 🎯 Prochaines étapes

- [ ] Ajouter authentification robuste (JWT)
- [ ] Déployer sur Vercel/Heroku
- [ ] Tests unitaires
- [ ] Notifications en temps réel (Socket.io)
