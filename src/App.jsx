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

  // איפוס חיפוש בעת מעבר בין מצבי הרשאה (consultation/gestion)
  useEffect(() => {
    setRecherche('')
  }, [isGestion])

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
    <div className="min-h-svh bg-transparent">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-3 pb-10 sm:px-5">
        <section className="panel-3d mt-4 rounded-2xl bg-white p-3 sm:p-4">
          <SearchBar valeur={recherche} onChange={setRecherche} />
          {isGestion && (
            <div className="px-1 pb-2">
              <button
                type="button"
                onClick={() => setModalAjout(true)}
                className="button-3d mx-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-red-600 to-red-700 py-3.5 text-base font-semibold text-white active:from-red-700 active:to-red-800"
              >
                <span className="text-xl leading-none">+</span>
                {he.addPackage}
              </button>
            </div>
          )}
        </section>

        <section className="panel-3d mt-4 rounded-2xl bg-white p-2 sm:p-3">
          <div className="mb-2 flex items-center justify-between px-2 sm:px-3">
            <p className="text-sm font-semibold text-slate-600">{departementActif?.nom}</p>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              {colisFiltres.length}
            </span>
          </div>
          <ColisList
            colis={colisFiltres}
            onModifier={modifierEmplacement}
            onSupprimer={supprimerColis}
            recherche={recherche}
          />
        </section>
      </main>

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
