# ✅ Checklist Déploiement Netlify + Railway

## Phase 1: Préparation locale ✓

- [x] Backend créé (Node.js/Express)
- [x] Frontend adaptée (React/Vite)
- [x] MongoDB connectée
- [x] API fonctionnelle
- [x] netlify.toml créé
- [x] Procfile (backend) créé
- [x] .gitignore mis à jour
- [x] Variables d'env configurées

## Phase 2: Avant le déploiement

- [ ] Repo GitHub créé
- [ ] Code pushé sur GitHub
- [ ] Compte Netlify créé
- [ ] Compte Railway créé

## Phase 3: Déploiement Frontend (Netlify)

- [ ] Repo connecté à Netlify
- [ ] Build réussit (npm run build)
- [ ] dist/ généré correctement
- [ ] Frontend accessible via URL Netlify
- [ ] Variable VITE_API_URL configurée

## Phase 4: Déploiement Backend (Railway)

- [ ] Repo connecté à Railway
- [ ] Dossier backend détecté
- [ ] MongoDB URI configurée
- [ ] PIN_GESTION configuré
- [ ] PORT=3000 configuré
- [ ] Backend en ligne
- [ ] Domaine public généré

## Phase 5: Tests d'intégration

```bash
curl https://ace-plan-production.up.railway.app/api/departements

# Test frontend
# - Ouvrir https://xxx.netlify.app
# - Vérifier que les données se chargent
# - Tester ajout/suppression

# Test CORS
# - Console navigateur (F12)
# - Pas d'erreurs CORS
```

- [ ] Backend répond correctement
- [ ] Frontend se charge
- [ ] Données affichées
- [ ] CORS fonctionne
- [ ] Mode Gestion fonctionne (PIN)

## Phase 6: Post-déploiement

- [ ] Ajouter URL Netlify au README
- [ ] Ajouter URL Railway au README
- [ ] Commit final
- [ ] Partager les URLs

---

## 🚀 Déploiement en 1 ligne

```bash
./deploy.sh
```

Puis redéployer via Netlify et Railway dashboards.

---

## 📞 En cas de problème

| Problème                   | Solution                                 |
| -------------------------- | ---------------------------------------- |
| Build Netlify échoue       | Vérifier `npm run build` localement      |
| Backend ne répond pas      | Vérifier les logs Railway                |
| CORS error                 | Ajouter `app.use(cors())` dans server.js |
| Données ne se chargent pas | Vérifier VITE_API_URL dans Netlify       |
| MongoDB ne se connecte pas | Vérifier MONGODB_URI dans Railway        |
| Port déjà utilisé          | Railway attribue automatiquement le port |

---

## 📊 Coûts

- Netlify: Gratuit ✓
- Railway: Gratuit (100$ crédits/mois) ✓
- MongoDB Atlas: Gratuit (512MB) ✓
- **Total: 0€ 🎉**

---

## 🎯 Prochaines étapes

Une fois déployé:

- [ ] Configurer domaine personnalisé (optionnel)
- [ ] Ajouter HTTPS (automatique)
- [ ] Configurer alertes de downtime
- [ ] Mettre en place CI/CD
- [ ] Ajouter des tests

---

**Dernière mise à jour**: 10 Jul 2026
**Status**: ✅ Prêt à déployer
