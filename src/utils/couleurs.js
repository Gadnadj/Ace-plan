/**
 * צבעי קטגוריה (מחלקות)
 * הצבעים כתובים במלואם כדי ש-Tailwind יזהה את המחלקות.
 */
export const COULEURS_CATEGORIE = [
  { cle: 'green', nom: 'ירוק', dot: 'bg-green-500' },
  { cle: 'red', nom: 'אדום', dot: 'bg-red-500' },
  { cle: 'orange', nom: 'כתום', dot: 'bg-orange-500' },
  { cle: 'amber', nom: 'צהוב', dot: 'bg-amber-400' },
  { cle: 'blue', nom: 'כחול', dot: 'bg-blue-500' },
  { cle: 'teal', nom: 'טורקיז', dot: 'bg-teal-500' },
  { cle: 'violet', nom: 'סגול', dot: 'bg-violet-500' },
  { cle: 'pink', nom: 'ורוד', dot: 'bg-pink-500' },
  { cle: 'slate', nom: 'אפור', dot: 'bg-slate-400' },
]

export const COULEUR_PAR_DEFAUT = 'slate'

const DOT_PAR_CLE = COULEURS_CATEGORIE.reduce((acc, c) => {
  acc[c.cle] = c.dot
  return acc
}, {})

export function classeDot(cle) {
  return DOT_PAR_CLE[cle] || DOT_PAR_CLE[COULEUR_PAR_DEFAUT]
}

/** צבע ברירת מחדל לפי שם המחלקה (למחלקות קיימות ללא צבע שמור) */
export function couleurParDefautParNom(nom = '') {
  if (nom.includes('ריהוט') || nom.includes('אמבטיה')) return 'green'
  if (nom.includes('מחסן')) return 'red'
  if (nom.includes('גינון') || nom.includes('גנים')) return 'orange'
  return COULEUR_PAR_DEFAUT
}

export function resoudreCouleur(couleurStockee, nom) {
  if (couleurStockee && DOT_PAR_CLE[couleurStockee]) return couleurStockee
  return couleurParDefautParNom(nom)
}
