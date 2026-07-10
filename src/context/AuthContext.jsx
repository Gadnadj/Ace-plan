import { createContext, useContext, useState } from 'react'
import { CONFIG } from '../config'

/**
 * Rôles disponibles dans l'application :
 * - 'consultation' : lecture seule (vendeurs) — mode par défaut
 * - 'gestion' : lecture + modification (logistique)
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Démarrage direct en mode consultation (liste visible immédiatement)
  const [role, setRole] = useState('consultation')

  /**
   * Connexion en mode Gestion (protégé par PIN)
   * @returns {boolean} true si le PIN est correct
   */
  const loginGestion = (pin) => {
    if (pin === CONFIG.PIN_GESTION) {
      setRole('gestion')
      return true
    }
    return false
  }

  /** Retour au mode consultation (lecture seule) */
  const quitterGestion = () => {
    setRole('consultation')
  }

  const isGestion = role === 'gestion'
  const isConsultation = role === 'consultation'

  return (
    <AuthContext.Provider
      value={{
        role,
        isGestion,
        isConsultation,
        loginGestion,
        quitterGestion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/** Hook pour accéder au contexte d'authentification */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
