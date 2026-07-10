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
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => setModalDepartement(true)}
              className="flex items-center gap-1.5 text-start active:opacity-70"
              aria-label={he.switchDepartment}
            >
              <h1 className="text-lg font-bold text-slate-800">
                {departementActif?.nom || he.appName}
              </h1>
              <span className="text-sm text-slate-400">▼</span>
            </button>
            {isGestion && (
              <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
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
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-500 active:bg-slate-200"
                  aria-label={he.settings}
                >
                  <span>⚙️</span>
                  <span>{he.settings}</span>
                </button>
                <button
                  type="button"
                  onClick={quitterGestion}
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 active:bg-slate-200"
                >
                  {he.quit}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setModalPin(true)}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-500 active:bg-slate-200"
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
