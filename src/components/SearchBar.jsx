import { he } from '../i18n/he'

export default function SearchBar({ valeur, onChange }) {
  return (
    <div className="px-1 py-2">
      <div className="relative mx-auto">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-red-400">
          🔍
        </span>
        <input
          type="text"
          value={valeur}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={he.searchPlaceholder}
          className="w-full rounded-xl border border-red-200 bg-white py-3.5 ps-12 pe-11 text-right text-lg font-medium text-slate-800 shadow-lg shadow-red-100/50 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
          aria-label={he.searchLabel}
          dir="rtl"
        />
        {valeur && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute end-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-red-50 text-red-500 active:bg-red-100"
            aria-label={he.clearSearch}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
