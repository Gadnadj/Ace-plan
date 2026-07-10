import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import zonesInitiales from '../data/zones.json';
import { CONFIG, cleZones } from '../config';
import { useDepartements } from './DepartementsContext';

const ZonesContext = createContext(null);
const API_URL = CONFIG.API_BASE_URL;

function extraireZonesDepuisAnciens(anciens) {
  const lettres = new Set();
  for (const item of anciens) {
    const match = String(item).match(/^([A-Z]+)-/i);
    if (match) lettres.add(match[1].toUpperCase());
  }
  return lettres.size > 0 ? [...lettres].sort() : zonesInitiales;
}

function migrerAnciennesZones(cle) {
  if (cle !== cleZones('meubles')) return null;
  const ancien = localStorage.getItem(CONFIG.ZONES_STORAGE_KEY);
  if (!ancien) return null;
  localStorage.setItem(cle, ancien);
  return ancien;
}

export function ZonesProvider({ children }) {
  const { actifId } = useDepartements();
  const [zones, setZones] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!actifId) return;

    setChargement(true);
    const charger = async () => {
      try {
        const res = await fetch(`${API_URL}/api/zones/${actifId}`);
        if (res.ok) {
          const data = await res.json();
          const triee = [...data].sort((a, b) => a.localeCompare(b));
          setZones(triee);
        } else {
          throw new Error('Erreur API');
        }
      } catch (err) {
        console.error('Erreur chargement zones:', err);
        // Fallback localStorage
        const cle = cleZones(actifId);
        let stockes = localStorage.getItem(cle);

        if (!stockes) {
          stockes = migrerAnciennesZones(cle);
        }

        if (stockes) {
          try {
            setZones(JSON.parse(stockes));
          } catch {
            setZones(zonesInitiales);
          }
        } else {
          const legacy = localStorage.getItem('stock-meubles-emplacements');
          if (legacy && actifId === 'meubles') {
            try {
              setZones(extraireZonesDepuisAnciens(JSON.parse(legacy)));
            } catch {
              setZones(zonesInitiales);
            }
          } else {
            setZones(actifId === 'meubles' ? zonesInitiales : []);
          }
        }
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [actifId]);

  const ajouterZone = useCallback(
    async (lettre) => {
      const valeur = lettre
        .trim()
        .toUpperCase()
        .replace(/[^A-Z]/g, '');
      if (!valeur) return { ok: false, erreur: 'empty' };
      if (zones.includes(valeur)) return { ok: false, erreur: 'exists' };

      const ajouterLocal = () => {
        const triee = [...zones, valeur].sort((a, b) => a.localeCompare(b));
        setZones(triee);
        localStorage.setItem(cleZones(actifId), JSON.stringify(triee));
      };

      try {
        const res = await fetch(`${API_URL}/api/zones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departementId: actifId, zone: valeur }),
        });

        if (res.ok) {
          ajouterLocal();
          return { ok: true };
        } else {
          let erreur = 'error';
          try {
            const data = await res.json();
            erreur = data?.erreur || 'error';
          } catch {
            erreur = 'error';
          }

          if (erreur === 'exists' || erreur === 'empty') {
            return { ok: false, erreur };
          }

          // Fallback local si l'API renvoie une erreur non gérée
          ajouterLocal();
          return { ok: true, fallback: true };
        }
      } catch (err) {
        console.error('Erreur ajout zone:', err);
        // Fallback local en cas d'absence backend/réseau
        ajouterLocal();
        return { ok: true, fallback: true };
      }
    },
    [zones, actifId],
  );

  const supprimerZone = useCallback(
    async (lettre) => {
      try {
        const res = await fetch(`${API_URL}/api/zones/${actifId}/${lettre}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          const triee = zones
            .filter((z) => z !== lettre)
            .sort((a, b) => a.localeCompare(b));
          setZones(triee);
          localStorage.setItem(cleZones(actifId), JSON.stringify(triee));
          return { ok: true };
        } else {
          return { ok: false, erreur: 'error' };
        }
      } catch (err) {
        console.error('Erreur suppression zone:', err);
        return { ok: false, erreur: 'error' };
      }
    },
    [zones, actifId],
  );

  return (
    <ZonesContext.Provider
      value={{ zones, chargement, ajouterZone, supprimerZone }}
    >
      {children}
    </ZonesContext.Provider>
  );
}

export function useZones() {
  const context = useContext(ZonesContext);
  if (!context) {
    throw new Error('useZones doit être utilisé dans un ZonesProvider');
  }
  return context;
}
