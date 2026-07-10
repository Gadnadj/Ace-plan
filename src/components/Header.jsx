import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDepartements } from '../context/DepartementsContext'
import { he } from '../i18n/he'
import AdminPinModal from './AdminPinModal'
import SettingsModal from './SettingsModal'
import DepartementSwitchModal from './DepartementSwitchModal'

export default function Header() {
  const { isGestion, quitterGestion } = useAuth()
  const { departementActif } = useDepartements()
  const [modalPin, setModalPin] = useState(false)
  const [modalSettings, setModalSettings] = useState(false)
  const [modalDepartement, setModalDepartement] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => setModalDepartement(true)}
              className="flex items-center gap-1.5 text-start active:opacity-80"
              aria-label={he.switchDepartment}
            >
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {departementActif?.nom || he.appName}
              </h1>
              <span className="text-xs text-slate-400">▼</span>
            </button>
            {isGestion && (
              <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                {he.gestion}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isGestion ? (
              <>
                <button
                  type="button"
                  onClick={() => setModalSettings(true)}
                  className="button-3d flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
                  aria-label={he.settings}
                >
                  <span>⚙️</span>
                  <span>{he.settings}</span>
                </button>
                <button
                  type="button"
                  onClick={quitterGestion}
                  className="button-3d rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
                >
                  {he.quit}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setModalPin(true)}
                className="button-3d flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
                aria-label={he.adminAccess}
              >
                <span>🔧</span>
                <span>{he.admin}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {modalPin && <AdminPinModal onClose={() => setModalPin(false)} />}
      {modalSettings && (
        <SettingsModal onClose={() => setModalSettings(false)} />
      )}
      {modalDepartement && (
        <DepartementSwitchModal onClose={() => setModalDepartement(false)} />
      )}
    </>
  )
}
