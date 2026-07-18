import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import departementsInitiaux from '../data/departements.json';
import { CONFIG } from '../config';
import { resoudreCouleur, COULEUR_PAR_DEFAUT } from '../utils/couleurs';

function mapperDepartement(d) {
  return {
    id: d.id ?? d._id,
    nom: d.nom,
    couleur: resoudreCouleur(d.couleur, d.nom),
  };
}

const DepartementsContext = createContext(null);

const API_URL = CONFIG.API_BASE_URL;
const DEFAULT_DEPARTEMENT_ID = 'meubles';
const DEFAULT_DEPARTEMENT_NAME = 'מלאי ריהוט';

function choisirDepartementInitial(liste, actifStocke) {
  const departementParDefaut = liste.find(
    (d) => d.id === DEFAULT_DEPARTEMENT_ID || d.nom === DEFAULT_DEPARTEMENT_NAME,
  );

  if (departementParDefaut) {
    return departementParDefaut.id;
  }

  if (actifStocke && liste.some((d) => d.id === actifStocke)) {
    return actifStocke;
  }

  return liste[0]?.id || '';
}

export function DepartementsProvider({ children }) {
  const [departements, setDepartements] = useState([]);
  const [actifId, setActifId] = useState('');
  const [chargement, setChargement] = useState(true);

  // Charger les départements depuis l'API ou localStorage en fallback
  useEffect(() => {
    const charger = async () => {
      try {
        const res = await fetch(`${API_URL}/api/departements`);
        if (res.ok) {
          const depts = await res.json();
          const deptsMappees = depts.map(mapperDepartement);
          setDepartements(deptsMappees);

          const actif = localStorage.getItem(CONFIG.DEPARTEMENT_ACTIF_KEY);
          const initialId = choisirDepartementInitial(deptsMappees, actif);
          setActifId(initialId);
          if (initialId) {
            localStorage.setItem(CONFIG.DEPARTEMENT_ACTIF_KEY, initialId);
          }
        } else {
          throw new Error('Erreur API');
        }
      } catch (err) {
        console.error('Erreur chargement départements:', err);
        // Fallback localStorage
        const stockes = localStorage.getItem(CONFIG.DEPARTEMENTS_STORAGE_KEY);
        let liste = departementsInitiaux;
        if (stockes) {
          try {
            liste = JSON.parse(stockes);
          } catch {
            liste = departementsInitiaux;
          }
        }
        setDepartements(liste.map(mapperDepartement));
        const actif = localStorage.getItem(CONFIG.DEPARTEMENT_ACTIF_KEY);
        const initialId = choisirDepartementInitial(liste, actif);
        setActifId(initialId);
        if (initialId) {
          localStorage.setItem(CONFIG.DEPARTEMENT_ACTIF_KEY, initialId);
        }
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const changerDepartement = useCallback((id) => {
    setActifId(id);
    localStorage.setItem(CONFIG.DEPARTEMENT_ACTIF_KEY, id);
  }, []);

  const ajouterDepartement = useCallback(
    async (nom, couleur = COULEUR_PAR_DEFAUT) => {
      const nomNettoye = nom.trim();
      if (!nomNettoye) return { ok: false, erreur: 'empty' };

      try {
        const res = await fetch(`${API_URL}/api/departements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom: nomNettoye, couleur }),
        });

        if (res.ok) {
          const { dept } = await res.json();
          const nouveau = mapperDepartement(dept);
          setDepartements([...departements, nouveau]);
          return { ok: true };
        } else {
          const { erreur } = await res.json();
          return { ok: false, erreur };
        }
      } catch (err) {
        console.error('Erreur ajout département:', err);
        return { ok: false, erreur: 'error' };
      }
    },
    [departements],
  );

  const modifierDepartement = useCallback(
    async (id, changes = {}) => {
      const modifieNom = changes.nom !== undefined;
      const modifieCouleur = changes.couleur !== undefined;
      const nomNettoye = modifieNom ? changes.nom.trim() : undefined;

      if (modifieNom && !nomNettoye) return { ok: false, erreur: 'empty' };

      if (modifieNom) {
        const existeDeja = departements.some(
          (d) => d.id !== id && d.nom === nomNettoye,
        );
        if (existeDeja) return { ok: false, erreur: 'exists' };
      }

      const appliquer = (d) => ({
        ...d,
        ...(modifieNom ? { nom: nomNettoye } : {}),
        ...(modifieCouleur ? { couleur: changes.couleur } : {}),
      });

      const appliquerLocal = () => {
        const liste = departements.map((d) => (d.id === id ? appliquer(d) : d));
        setDepartements(liste);
        localStorage.setItem(
          CONFIG.DEPARTEMENTS_STORAGE_KEY,
          JSON.stringify(liste),
        );
      };

      const body = {};
      if (modifieNom) body.nom = nomNettoye;
      if (modifieCouleur) body.couleur = changes.couleur;

      try {
        const res = await fetch(`${API_URL}/api/departements/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          setDepartements((prev) =>
            prev.map((d) => (d.id === id ? appliquer(d) : d)),
          );
          return { ok: true };
        }

        const data = await res.json().catch(() => ({}));
        if (data.erreur === 'exists') return { ok: false, erreur: 'exists' };

        // Fallback local (API indisponible / test hors-ligne)
        appliquerLocal();
        return { ok: true, fallback: true };
      } catch (err) {
        console.error('Erreur modification département:', err);
        appliquerLocal();
        return { ok: true, fallback: true };
      }
    },
    [departements],
  );

  const supprimerDepartement = useCallback(
    async (id) => {
      if (departements.length <= 1) return { ok: false, erreur: 'last' };

      try {
        const res = await fetch(`${API_URL}/api/departements/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          const liste = departements.filter((d) => d.id !== id);
          setDepartements(liste);
          if (actifId === id) {
            changerDepartement(liste[0].id);
          }
          return { ok: true };
        } else {
          return { ok: false, erreur: 'error' };
        }
      } catch (err) {
        console.error('Erreur suppression département:', err);
        return { ok: false, erreur: 'error' };
      }
    },
    [departements, actifId, changerDepartement],
  );

  const departementActif = departements.find((d) => d.id === actifId) || null;

  return (
    <DepartementsContext.Provider
      value={{
        departements,
        departementActif,
        actifId,
        chargement,
        changerDepartement,
        ajouterDepartement,
        modifierDepartement,
        supprimerDepartement,
      }}
    >
      {children}
    </DepartementsContext.Provider>
  );
}

export function useDepartements() {
  const context = useContext(DepartementsContext);
  if (!context) {
    throw new Error(
      'useDepartements doit être utilisé dans un DepartementsProvider',
    );
  }
  return context;
}
