import { useState, useMemo, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DepartementsProvider, useDepartements } from './context/DepartementsContext'
import { ZonesProvider } from './context/ZonesContext'
import { useColis } from './hooks/useColis'
import { he } from './i18n/he'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import ColisList from './components/ColisList'
import AddColisModal from './components/AddColisModal'

function MainApp() {
  const { isGestion } = useAuth()
  const { actifId, departementActif, chargement: chargementDept } = useDepartements()
  const [recherche, setRecherche] = useState('')
  const [modalAjout, setModalAjout] = useState(false)
  const {
    colis,
    chargement,
    modifierEmplacement,
    ajouterColis,
    supprimerColis,
    filtrerColis,
  } = useColis()

  // איפוס חיפוש בעת החלפת מחלקה
  useEffect(() => {
    setRecherche('')
    setModalAjout(false)
  }, [actifId])

  // עדכון כותרת הדף
  useEffect(() => {
    document.title = departementActif
      ? `${departementActif.nom} — ניהול מחסן`
      : 'ניהול מחסן'
  }, [departementActif])

  const colisFiltres = useMemo(
    () => filtrerColis(recherche),
    [filtrerColis, recherche],
  )

  if (chargementDept || chargement) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-lg text-slate-500">{he.loading}</p>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <Header />
      <SearchBar valeur={recherche} onChange={setRecherche} />

      {isGestion && (
        <div className="px-4 pb-3">
          <button
            type="button"
            onClick={() => setModalAjout(true)}
            className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 py-4 text-base font-semibold text-amber-700 active:bg-amber-100"
          >
            <span className="text-xl">+</span>
            {he.addPackage}
          </button>
        </div>
      )}

      <ColisList
        colis={colisFiltres}
        onModifier={modifierEmplacement}
        onSupprimer={supprimerColis}
        recherche={recherche}
      />

      {modalAjout && (
        <AddColisModal
          onClose={() => setModalAjout(false)}
          onSave={ajouterColis}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DepartementsProvider>
        <ZonesProvider>
          <MainApp />
        </ZonesProvider>
      </DepartementsProvider>
    </AuthProvider>
  )
}
