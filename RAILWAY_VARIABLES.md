# 🚨 VARIABLES RAILWAY - SUPER SIMPLE

## Les 3 variables à ajouter dans Railway

### Étape 1: Aller dans Railway Dashboard

1. Créer le projet
2. Aller dans **Build & deploy** → **Environment**

### Étape 2: Ajouter les 3 variables (copy-paste)

**Copier-coller EXACTEMENT ceci:**

```
MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
PIN_GESTION=2122
NODE_ENV=production
```

C'est tout! Pas plus, pas moins.

---

## Pourquoi ces 3?

| Variable        | Quoi?                            | Valeur            |
| --------------- | -------------------------------- | ----------------- |
| **MONGODB_URI** | Connexion à la base de données   | mongodb+srv://... |
| **PIN_GESTION** | Code pour accéder à la gestion   | 1234              |
| **NODE_ENV**    | Mode production ou développement | production        |

---

## C'est fini?

Oui! Railway va:

- ✅ Lire ces variables
- ✅ Lancer le serveur
- ✅ Se connecter à MongoDB
- ✅ Générer une URL publique

---

## Question: Et PORT?

**NON**, pas besoin! Railway attribue le port automatiquement (3000, 3001, etc.)

---

## Copy-paste pour les fainéants

```bash
MONGODB_URI=mongodb+srv://gnadjar:salbZtn4o1Fr5kwG@cluster0.lrm3nqe.mongodb.net/?appName=Cluster0
PIN_GESTION=1234
NODE_ENV=production
```

Copier ces 3 lignes dans Railway et c'est bon! ✨
