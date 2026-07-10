import { useEffect, useState } from 'react'

const STORAGE_KEY_INSTALL_PROMPT_SEEN = 'plan-pwa-install-prompt-seen'

export default function InstallPwaPrompt() {
  const [installEvent, setInstallEvent] = useState(null)
  const [canInstallNow, setCanInstallNow] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dejaInstalle =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (dejaInstalle) {
      localStorage.setItem(STORAGE_KEY_INSTALL_PROMPT_SEEN, '1')
      return
    }

    const dejaVu = localStorage.getItem(STORAGE_KEY_INSTALL_PROMPT_SEEN) === '1'
    if (!dejaVu) {
      setVisible(true)
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallEvent(event)
      setCanInstallNow(true)
    }

    const handleAppInstalled = () => {
      setVisible(false)
      setInstallEvent(null)
      setCanInstallNow(false)
      localStorage.setItem(STORAGE_KEY_INSTALL_PROMPT_SEEN, '1')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstaller = async () => {
    if (installEvent) {
      await installEvent.prompt()
      setVisible(false)
      setInstallEvent(null)
      setCanInstallNow(false)
      localStorage.setItem(STORAGE_KEY_INSTALL_PROMPT_SEEN, '1')
      return
    }

    window.alert(
      'Installation directe non disponible sur cet appareil/navigateur. Dans Chrome Android: menu ⋮ puis "Ajouter à l’écran d’accueil" ou "Installer l’application".'
    )
  }

  const handleFermer = () => {
    setVisible(false)
    setInstallEvent(null)
    setCanInstallNow(false)
    localStorage.setItem(STORAGE_KEY_INSTALL_PROMPT_SEEN, '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
      <p className="text-sm font-semibold text-slate-800">Installer l’application</p>
      <p className="mt-1 text-xs text-slate-500">
        {canInstallNow
          ? 'Ajoute ce site sur ton écran d’accueil pour un accès rapide.'
          : 'Sur Chrome Android: ouvre le menu ⋮ puis choisis "Ajouter à l’écran d’accueil" ou "Installer l’application".'}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleFermer}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100"
        >
          Plus tard
        </button>
        <button
          type="button"
          onClick={handleInstaller}
          className="button-3d flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white active:bg-slate-800"
        >
          Installer
        </button>
      </div>
    </div>
  )
}
