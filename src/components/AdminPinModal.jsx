import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { he } from '../i18n/he'

export default function AdminPinModal({ onClose }) {
  const { loginGestion } = useAuth()
  const [pin, setPin] = useState('')
  const [erreur, setErreur] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErreur('')
    if (loginGestion(pin)) {
      setPin('')
      onClose()
    } else {
      setErreur(he.pinWrong)
      setPin('')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pin-titre"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-pin-titre" className="text-xl font-bold text-slate-800">
          {he.pinTitle}
        </h2>
        <p className="mt-1 text-slate-500">{he.pinSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            autoFocus
            dir="ltr"
            className="mb-4 w-full rounded-2xl border-2 border-slate-200 px-6 py-5 text-center text-3xl font-bold tracking-[0.5em] text-slate-800 outline-none focus:border-amber-500"
            aria-label={he.pinLabel}
          />

          {erreur && (
            <p className="mb-4 text-center text-sm text-red-600" role="alert">
              {erreur}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-4 text-base font-semibold text-slate-600 active:bg-slate-200"
            >
              {he.cancel}
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="flex-1 rounded-2xl bg-amber-500 py-4 text-base font-semibold text-white active:bg-amber-600 disabled:opacity-40"
            >
              {he.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
