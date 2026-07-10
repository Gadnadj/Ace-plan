import { useState, useEffect, useCallback } from 'react'
import colisInitiaux from '../data/colis.json'
import { CONFIG, cleColis } from '../config'
import { he } from '../i18n/he'
import { useDepartements } from '../context/DepartementsContext'

const API_URL = CONFIG.API_BASE_URL

function genererId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function normaliserColis(liste) {
  return liste.map((c) => ({ ...c, id: c.id || genererId() }))
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
          // Normaliser les données de l'API
          const normalises = data.map(c => ({
            id: c.id || c._id,
            titre: c.titre,
            zone: c.zone,
            position: c.position || '',
            description: c.description || '',
            departementId: c.departementId,
          }))
          setColis(normalises)
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
    async (id, nouvelleZone, nouvellePosition) => {
      try {
        const res = await fetch(`${API_URL}/api/colis/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zone: nouvelleZone.trim(),
            position: nouvellePosition?.trim() || ''
          })
        })

        if (res.ok) {
          const updated = await res.json()
          const nouveauxColis = colis.map(c =>
            c.id === id
              ? {
                id: updated.id || updated._id,
                titre: updated.titre,
                zone: updated.zone,
                position: updated.position || '',
                description: updated.description || '',
                departementId: updated.departementId,
              }
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
    [colis],
  )

  const ajouterColis = useCallback(
    async (titre, zone, position, description) => {
      const titreNettoye = titre.trim()
      const zoneNettoye = zone.trim()
      const positionNettoye = position?.trim() || ''

      if (!titreNettoye) {
        return { ok: false, erreur: he.locationCannotBeEmpty }
      }
      if (!zoneNettoye) {
        return { ok: false, erreur: 'Zone requise' }
      }

      try {
        const res = await fetch(`${API_URL}/api/colis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            departementId: actifId,
            titre: titreNettoye,
            zone: zoneNettoye,
            position: positionNettoye,
            description: description?.trim() || ''
          })
        })

        if (res.ok) {
          const nouveauColis = await res.json()
          const normalise = {
            id: nouveauColis.id || nouveauColis._id,
            titre: nouveauColis.titre,
            zone: nouveauColis.zone,
            position: nouveauColis.position || '',
            description: nouveauColis.description || '',
            departementId: nouveauColis.departementId,
          }
          setColis([...colis, normalise].sort((a, b) => a.titre.localeCompare(b.titre)))
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur ajout colis:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis, actifId],
  )

  const supprimerColis = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/colis/${id}`, {
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
    [colis],
  )

  const filtrerColis = useCallback(
    (recherche) => {
      const terme = recherche.trim().toUpperCase()
      if (!terme) return colis

      return colis.filter((c) => {
        const titre = c.titre.toUpperCase()
        const zone = c.zone.toUpperCase()
        const position = (c.position || '').toUpperCase()
        return titre.includes(terme) || zone.includes(terme) || position.includes(terme)
      })
    },
    [colis],
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
