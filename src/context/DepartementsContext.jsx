import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import departementsInitiaux from '../data/departements.json';
import { CONFIG } from '../config';

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
          const deptsMappees = depts.map((d) => ({ id: d._id, nom: d.nom }));
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
        setDepartements(liste);
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
    async (nom) => {
      const nomNettoye = nom.trim();
      if (!nomNettoye) return { ok: false, erreur: 'empty' };

      try {
        const res = await fetch(`${API_URL}/api/departements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom: nomNettoye }),
        });

        if (res.ok) {
          const { dept } = await res.json();
          const nouveau = { id: dept._id, nom: dept.nom };
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
