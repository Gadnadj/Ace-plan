import { useState, useEffect, useCallback, useMemo } from 'react'
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
  const { actifId, departements } = useDepartements()
  const [colis, setColis] = useState([])
  const [colisGlobaux, setColisGlobaux] = useState([])
  const [chargement, setChargement] = useState(true)

  const nomParDepartement = useMemo(() => {
    const map = {}
    departements.forEach((d) => {
      map[d.id] = d.nom
    })
    return map
  }, [departements])

  const chargerColisParDepartement = useCallback(async (departementId) => {
    try {
      const res = await fetch(`${API_URL}/api/colis/${departementId}`)
      if (res.ok) {
        const data = await res.json()
        return normaliserColis(data)
      }
      throw new Error('Erreur API')
    } catch {
      const cle = cleColis(departementId)
      let stockes = localStorage.getItem(cle)
      if (!stockes) {
        stockes = migrerAnciensColis(cle)
      }
      if (!stockes) return []
      try {
        return normaliserColis(JSON.parse(stockes))
      } catch {
        return []
      }
    }
  }, [])

  const verifierDoublonsCode = useCallback(
    async (code) => {
      const codeNormalise = normaliserRechercheTexte(code)
      if (!codeNormalise || departements.length === 0) return []

      const verifications = await Promise.all(
        departements.map(async (departement) => {
          const liste = await chargerColisParDepartement(departement.id)
          const existe = liste.some(
            (c) => normaliserRechercheTexte(c.code) === codeNormalise
          )
          return existe ? departement.nom : null
        })
      )

      return verifications.filter(Boolean)
    },
    [departements, chargerColisParDepartement]
  )

  const chargerTousColis = useCallback(async () => {
    if (departements.length === 0) {
      setColisGlobaux([])
      return
    }

    const listes = await Promise.all(
      departements.map(async (departement) => {
        const liste = await chargerColisParDepartement(departement.id)
        return liste.map((c) => ({
          ...c,
          departementId: c.departementId || departement.id,
          categorieNom: departement.nom,
        }))
      })
    )

    setColisGlobaux(listes.flat())
  }, [departements, chargerColisParDepartement])

  useEffect(() => {
    chargerTousColis()
  }, [chargerTousColis])

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
            setColis([])
          }
        } else {
          setColis([])
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
        const colisCible =
          colis.find((c) => c.id === id) || colisGlobaux.find((c) => c.id === id)
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
          chargerTousColis()
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur modification emplacement:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis, colisGlobaux, chargerTousColis]
  )

  const ajouterColis = useCallback(
    async (code, emplacement, options = {}) => {
      const codeNettoye = code.trim()
      const emplacementNettoye = emplacement.trim()
      const { zone, number } = parseEmplacement(emplacementNettoye)
      const zoneNettoye = zone || emplacementNettoye
      const force = options.force === true

      if (!codeNettoye) {
        return { ok: false, erreur: he.locationCannotBeEmpty }
      }
      if (!emplacementNettoye) {
        return { ok: false, erreur: 'Zone requise' }
      }

      if (!force) {
        const departementsDoublons = await verifierDoublonsCode(codeNettoye)
        if (departementsDoublons.length > 0) {
          return {
            ok: false,
            erreur: 'duplicateCode',
            departements: departementsDoublons,
          }
        }
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
          chargerTousColis()
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur ajout colis:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis, actifId, verifierDoublonsCode, chargerTousColis]
  )

  const supprimerColis = useCallback(
    async (id) => {
      try {
        const colisCible =
          colis.find((c) => c.id === id) || colisGlobaux.find((c) => c.id === id)
        const idApi = colisCible?.backendId || id
        const res = await fetch(`${API_URL}/api/colis/${idApi}`, {
          method: 'DELETE'
        })

        if (res.ok) {
          setColis(colis.filter(c => c.id !== id))
          chargerTousColis()
          return { ok: true }
        } else {
          return { ok: false, erreur: 'error' }
        }
      } catch (err) {
        console.error('Erreur suppression colis:', err)
        return { ok: false, erreur: 'error' }
      }
    },
    [colis, colisGlobaux, chargerTousColis]
  )

  const filtrerColis = useCallback(
    (recherche) => {
      const terme = normaliserRechercheTexte(recherche)

      // ללא חיפוש: מציגים רק את המחלקה הפעילה
      if (!terme) {
        const nomActif = nomParDepartement[actifId] || ''
        return colis.map((c) => ({ ...c, categorieNom: c.categorieNom || nomActif }))
      }

      // חיפוש: מחפשים בכל המחלקות ומציגים את הקטגוריה של כל תוצאה
      return colisGlobaux.filter((c) => {
        const code = normaliserRechercheTexte(c.code)
        const emplacement = normaliserRechercheTexte(c.emplacement)
        return code.includes(terme) || emplacement.includes(terme)
      })
    },
    [colis, colisGlobaux, actifId, nomParDepartement]
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
