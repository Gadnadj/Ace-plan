import { useEffect } from 'react'
import { useDepartements } from '../context/DepartementsContext'
import { he } from '../i18n/he'

export default function DepartementSwitchModal({ onClose }) {
  const { departements, actifId, changerDepartement } = useDepartements()

  useEffect(() => {
    const precedentOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedentOverflow
    }
  }, [])

  const handleChoisir = (id) => {
    changerDepartement(id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dept-switch-titre"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dept-switch-titre" className="text-xl font-bold text-slate-800">
          {he.switchDepartment}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{he.switchDepartmentSubtitle}</p>

        <ul className="mt-6 flex flex-col gap-2">
          {departements.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => handleChoisir(d.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold transition-colors ${
                  d.id === actifId
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-800 active:bg-slate-100'
                }`}
              >
                <span>{d.nom}</span>
                {d.id === actifId && <span className="text-sm">✓</span>}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 text-base font-semibold text-slate-700 active:bg-slate-100"
        >
          {he.close}
        </button>
      </div>
    </div>
  )
}
