import { useEffect, useState } from 'react'
import { he } from '../i18n/he'
import LocationInput from './LocationInput'

export default function ModifyModal({ colis, onClose, onSave }) {
  const [emplacement, setEmplacement] = useState(colis.emplacement)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const precedentOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedentOverflow
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!emplacement) {
      setErreur(he.locationEmpty)
      return
    }
    onSave(emplacement)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 backdrop-blur-sm sm:items-center sm:p-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titre"
    >
      <div
        className="w-full max-w-xl rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-titre" className="text-xl font-bold text-slate-800">
          {he.editTitle}
        </h2>
        <p className="mt-1 text-slate-500">
          {he.package}{' '}
          <span className="font-bold text-slate-800" dir="ltr">
            {colis.code}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="emplacement"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            {he.newLocation}
          </label>
          <LocationInput
            value={emplacement}
            onChange={(val) => {
              setEmplacement(val)
              setErreur('')
            }}
            autoFocus
          />

          {erreur && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {erreur}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-4 text-base font-semibold text-slate-700 active:bg-slate-100"
            >
              {he.cancel}
            </button>
            <button
              type="submit"
              disabled={!emplacement}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-base font-semibold text-white active:bg-slate-800 disabled:opacity-40"
            >
              {he.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
