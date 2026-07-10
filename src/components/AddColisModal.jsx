import { useState } from 'react'
import { he } from '../i18n/he'
import LocationInput from './LocationInput'

export default function AddColisModal({ onClose, onSave }) {
  const [code, setCode] = useState('')
  const [emplacement, setEmplacement] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const resultat = onSave(code, emplacement)
    if (resultat.ok) {
      onClose()
    } else {
      setErreur(resultat.erreur)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-ajout-titre"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-ajout-titre" className="text-xl font-bold text-slate-800">
          {he.addTitle}
        </h2>
        <p className="mt-1 text-slate-500">{he.addSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              {he.productCode}
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''))
                setErreur('')
              }}
              autoFocus
              dir="ltr"
              placeholder={he.codePlaceholder}
              className="w-full rounded-2xl border-2 border-slate-200 px-4 py-4 text-center text-2xl font-bold tracking-widest text-slate-800 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              {he.location}
            </label>
            <LocationInput
              value={emplacement}
              onChange={(val) => {
                setEmplacement(val)
                setErreur('')
              }}
            />
          </div>

          {erreur && (
            <p className="text-sm text-red-600" role="alert">
              {erreur}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-4 text-base font-semibold text-slate-600 active:bg-slate-200"
            >
              {he.cancel}
            </button>
            <button
              type="submit"
              disabled={code.length !== 3 || !emplacement}
              className="flex-1 rounded-2xl bg-amber-500 py-4 text-base font-semibold text-white active:bg-amber-600 disabled:opacity-40"
            >
              {he.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
