import { he } from '../i18n/he'

export default function DeleteColisModal({ colis, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-suppr-titre"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
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
            className="flex-1 rounded-2xl bg-slate-100 py-4 text-base font-semibold text-slate-600 active:bg-slate-200"
          >
            {he.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(colis.id)
              onClose()
            }}
            className="flex-1 rounded-2xl bg-red-500 py-4 text-base font-semibold text-white active:bg-red-600"
          >
            {he.delete}
          </button>
        </div>
      </div>
    </div>
  )
}
