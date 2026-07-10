import { useState, useEffect, useCallback } from 'react'
import colisInitiaux from '../data/colis.json'
import { CONFIG, cleColis } from '../config'
import { he } from '../i18n/he'
import { useDepartements } from '../context/DepartementsContext'
import { parseEmplacement } from '../utils/emplacement'

const API_URL = CONFIG.API_BASE_URL

function normaliserRechercheTexte(valeur) {
  return String(valeur || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

function genererId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function normaliserUnColis(colis) {
  const backendId = colis._id || colis.backendId || null
  const id = colis.id || backendId || genererId()
  const code = String(colis.code ?? colis.titre ?? '')
  const emplacement =
    colis.emplacement || colis.position || colis.zone || ''
  const updatedAt = colis.updatedAt || colis.dateModification || colis.createdAt || null

  return {
    ...colis,
    id,
    backendId,
    code,
    emplacement,
    updatedAt,
    dateModification: updatedAt,
  }
}

function normaliserColis(liste) {
  return liste.map(normaliserUnColis)
}

/** מעביר נתונים ישנים למחלקת ריהוט */
function migrerAnciensColis(cle) {
  if (cle !== cleColis('meubles')) return null
  const ancien = localStorage.getItem(CONFIG.STORAGE_KEY)
  if (!ancien) return null
  localStorage.setItem(cle, ancien)
  return ancien
}

export function useColis() {
  const { actifId } = useDepartements()
  const [colis, setColis] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    if (!actifId) return

    setChargement(true)
    const charger = async () => {
      try {
        const res = await fetch(`${API_URL}/api/colis/${actifId}`)
        if (res.ok) {
          const data = await res.json()
          setColis(normaliserColis(data))
        } else {
          throw new Error('Erreur API')
        }
      } catch (err) {
        console.error('Erreur chargement colis:', err)
        // Fallback localStorage
        const cle = cleColis(actifId)
        let stockes = localStorage.getItem(cle)

        if (!stockes) {
          stockes = migrerAnciensColis(cle)
        }

        if (stockes) {
          try {
            setColis(normaliserColis(JSON.parse(stockes)))
          } catch {
            setColis(actifId === 'meubles' ? normaliserColis(colisInitiaux) : [])
          }
        } else {
          setColis(actifId === 'meubles' ? normaliserColis(colisInitiaux) : [])
        }
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [actifId])

  const modifierEmplacement = useCallback(
    async (id, nouvelEmplacement) => {
      try {
        const colisCible = colis.find((c) => c.id === id)
        const idApi = colisCible?.backendId || id
        const emplacementNettoye = nouvelEmplacement.trim()
        const { zone, number } = parseEmplacement(emplacementNettoye)

        const res = await fetch(`${API_URL}/api/colis/${idApi}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zone: zone || emplacementNettoye,
            position: emplacementNettoye,
            description: number || '',
          }),
        })

        if (res.ok) {
          const updated = await res.json()
          const normalise = normaliserUnColis(updated)
          const nouveauxColis = colis.map((c) =>
            c.id === id
              ? { ...c, ...normalise, emplacement: emplacementNettoye }
              : c
          )
          setColis(nouveauxColis)
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur modification emplacement:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis]
  )

  const ajouterColis = useCallback(
    async (code, emplacement) => {
      const codeNettoye = code.trim()
      const emplacementNettoye = emplacement.trim()
      const { zone, number } = parseEmplacement(emplacementNettoye)
      const zoneNettoye = zone || emplacementNettoye

      if (!codeNettoye) {
        return { ok: false, erreur: he.locationCannotBeEmpty }
      }
      if (!emplacementNettoye) {
        return { ok: false, erreur: 'Zone requise' }
      }

      try {
        const res = await fetch(`${API_URL}/api/colis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            departementId: actifId,
            titre: codeNettoye,
            zone: zoneNettoye,
            position: emplacementNettoye,
            description: number || '',
          }),
        })

        if (res.ok) {
          const nouveauColis = await res.json()
          const normalise = {
            ...normaliserUnColis(nouveauColis),
            code: codeNettoye,
            emplacement: emplacementNettoye,
          }
          setColis([...colis, normalise].sort((a, b) => a.code.localeCompare(b.code)))
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur ajout colis:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis, actifId]
  )

  const supprimerColis = useCallback(
    async (id) => {
      try {
        const colisCible = colis.find((c) => c.id === id)
        const idApi = colisCible?.backendId || id
        const res = await fetch(`${API_URL}/api/colis/${idApi}`, {
          method: 'DELETE'
        })

        if (res.ok) {
          setColis(colis.filter(c => c.id !== id))
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur suppression colis:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis]
  )

  const filtrerColis = useCallback(
    (recherche) => {
      const terme = normaliserRechercheTexte(recherche)
      if (!terme) return colis

      return colis.filter((c) => {
        const code = normaliserRechercheTexte(c.code)
        const emplacement = normaliserRechercheTexte(c.emplacement)
        return code.includes(terme) || emplacement.includes(terme)
      })
    },
    [colis]
  )

  return {
    colis,
    chargement,
    modifierEmplacement,
    ajouterColis,
    supprimerColis,
    filtrerColis,
  }
}
