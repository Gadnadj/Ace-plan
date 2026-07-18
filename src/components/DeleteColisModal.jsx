import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { he } from '../i18n/he'

export default function DeleteColisModal({ colis, onClose, onConfirm }) {
  useEffect(() => {
    const precedentOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedentOverflow
    }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-suppr-titre"
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-suppr-titre" className="text-xl font-bold text-slate-800">
          {he.deleteTitle}
        </h2>
        <p className="mt-3 text-slate-600">
          {he.deleteMessage(colis.code, colis.emplacement)}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-4 text-base font-semibold text-slate-700 active:bg-slate-100"
          >
            {he.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(colis.id)
              onClose()
            }}
            className="flex-1 rounded-2xl bg-rose-600 py-4 text-base font-semibold text-white active:bg-rose-700"
          >
            {he.delete}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
