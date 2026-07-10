/**
 * מפרק ומרכיב מיקום בפורמט אות-מספר (למשל A-06)
 */
export function parseEmplacement(value) {
  const match = value?.match(/^([A-Z]+)-(\d+)$/i)
  if (match) {
    return { zone: match[1].toUpperCase(), number: match[2] }
  }
  return { zone: '', number: '' }
}

export function formatEmplacement(zone, number) {
  const z = zone?.trim().toUpperCase()
  const n = number?.replace(/\D/g, '')
  if (!z || !n) return ''
  return `${z}-${n.padStart(2, '0')}`
}
