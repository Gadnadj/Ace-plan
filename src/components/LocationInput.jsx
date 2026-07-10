import { useState, useEffect } from 'react'
import { useZones } from '../context/ZonesContext'
import { parseEmplacement, formatEmplacement } from '../utils/emplacement'
import { he } from '../i18n/he'

/**
 * בחירת מיקום: אותיות מההגדרות משמאל לימין, מספר מתחת
 */
export default function LocationInput({ value, onChange, autoFocus = false }) {
  const { zones } = useZones()
  const parsed = parseEmplacement(value)

  const lettresAffichees =
    parsed.zone && !zones.includes(parsed.zone)
      ? [...zones, parsed.zone].sort()
      : zones

  const [zone, setZone] = useState(parsed.zone || zones[0] || '')
  const [number, setNumber] = useState(parsed.number)

  const zoneActive = zone || zones[0] || ''

  useEffect(() => {
    const p = parseEmplacement(value)
    if (p.zone) setZone(p.zone)
    if (p.number) setNumber(p.number.replace(/^0+/, '') || p.number)
  }, [value])

  useEffect(() => {
    if (!zone && zones.length > 0) {
      setZone(zones[0])
    }
  }, [zones, zone])

  const mettreAJour = (z, n) => {
    setZone(z)
    setNumber(n)
    onChange(formatEmplacement(z, n))
  }

  const handleZone = (z) => mettreAJour(z, number)

  const handleNumber = (n) => {
    const chiffres = n.replace(/\D/g, '').slice(0, 2)
    mettreAJour(zoneActive, chiffres)
  }

  if (lettresAffichees.length === 0) {
    return (
      <p className="text-center text-sm text-slate-500">{he.noZones}</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3" dir="ltr">
        {lettresAffichees.map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => handleZone(z)}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold transition-colors ${
              zoneActive === z
                ? 'bg-slate-900 text-white shadow-sm'
                : 'border border-slate-200 bg-slate-50 text-slate-700 active:bg-slate-100'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-center text-sm font-medium text-slate-600">
          {he.locationNumber}
        </label>
        <div className="flex items-center justify-center gap-2" dir="ltr">
          <span className="text-2xl font-bold text-slate-800">{zoneActive}-</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={number}
            onChange={(e) => handleNumber(e.target.value)}
            autoFocus={autoFocus}
            placeholder={he.numberPlaceholder}
            aria-label={he.locationNumber}
            className="w-24 rounded-2xl border border-slate-300 px-4 py-4 text-center text-2xl font-bold text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      {zoneActive && number && (
        <p className="text-center text-sm text-slate-500">
          {he.locationPreview}:{' '}
          <span className="font-bold text-slate-800">
            {formatEmplacement(zoneActive, number)}
          </span>
        </p>
      )}
    </div>
  )
}
