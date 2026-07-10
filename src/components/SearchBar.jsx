import { he } from '../i18n/he'

export default function SearchBar({ valeur, onChange }) {
  return (
    <div className="px-4 py-3">
      <div className="relative mx-auto max-w-lg">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
          🔍
        </span>
        <input
          type="text"
          value={valeur}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={he.searchPlaceholder}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 ps-12 pe-4 text-lg font-medium text-slate-800 outline-none focus:border-blue-500"
          aria-label={he.searchLabel}
          dir="ltr"
        />
        {valeur && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute end-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:bg-slate-200"
            aria-label={he.clearSearch}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
