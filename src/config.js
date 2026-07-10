/**
 * הגדרות האפליקציה
 */
export const CONFIG = {
  PIN_GESTION: '2122',
  STORAGE_PREFIX: 'stock',
  DEPARTEMENTS_STORAGE_KEY: 'stock-departements',
  DEPARTEMENT_ACTIF_KEY: 'stock-departement-actif',
  ZONES_STORAGE_KEY: 'stock-meubles-zones-v2',
  STORAGE_KEY: 'stock-meubles-colis',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
}

export function cleColis(departementId) {
  return `${CONFIG.STORAGE_PREFIX}-${departementId}-colis`
}

export function cleZones(departementId) {
  return `${CONFIG.STORAGE_PREFIX}-${departementId}-zones`
}
