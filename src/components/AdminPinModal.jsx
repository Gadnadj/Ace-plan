import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { he } from '../i18n/he'

export default function AdminPinModal({ onClose }) {
  const { loginGestion } = useAuth()
  const [pin, setPin] = useState('')
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const precedentOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedentOverflow
    }
  }, [])

  const tryLogin = (value) => {
    setErreur('')
    if (loginGestion(value)) {
      setPin('')
      onClose()
      return
    }
    setErreur(he.pinWrong)
    setPin('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin.length === 4) {
      tryLogin(pin)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pin-titre"
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl"
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
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const prochainPin = e.target.value.replace(/\D/g, '').slice(0, 4)
              setPin(prochainPin)
              if (prochainPin.length === 4) {
                tryLogin(prochainPin)
              } else {
                setErreur('')
              }
            }}
            placeholder="••••"
            autoFocus
            dir="ltr"
            className="mb-4 w-full rounded-2xl border border-slate-300 px-6 py-5 text-center text-3xl font-bold tracking-[0.5em] text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-4 text-base font-semibold text-slate-700 active:bg-slate-100"
            >
              {he.cancel}
            </button>
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="flex-1 rounded-2xl bg-slate-900 py-4 text-base font-semibold text-white active:bg-slate-800 disabled:opacity-40"
            >
              {he.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
