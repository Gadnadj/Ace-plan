# Backend Documentation

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Créez un fichier `.env` à la racine du dossier `backend/` avec:

```
MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
PIN_GESTION=1234
PORT=5000
NODE_ENV=development
```

## Démarrage

**Mode développement (avec auto-reload):**

```bash
npm run dev
```

**Mode production:**

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## API Endpoints

### Authentification

- `POST /api/auth/login` - Vérifier le PIN

### Départements

- `GET /api/departements` - Lister tous les départements
- `POST /api/departements` - Ajouter un département
- `DELETE /api/departements/:id` - Supprimer un département

### Zones

- `GET /api/zones/:departementId` - Lister les zones d'un département
- `POST /api/zones` - Ajouter une zone
- `DELETE /api/zones/:departementId/:zone` - Supprimer une zone

### Colis

- `GET /api/colis/:departementId` - Lister les colis d'un département
- `POST /api/colis` - Ajouter un colis
- `PATCH /api/colis/:id` - Modifier un colis
- `DELETE /api/colis/:id` - Supprimer un colis

## Architecture

- **models.js** - Schémas Mongoose (Departement, Zone, Colis)
- **server.js** - Application Express et routes API
- **.env** - Variables d'environnement (ne pas commiter)
