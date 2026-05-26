import { createContext, useContext, useState, useCallback, useRef, type ReactElement } from 'react'
import { TbMail, TbFileText, TbTrophy } from 'react-icons/tb'
import { FaLock, FaCheck, FaExplosion, FaStar } from 'react-icons/fa6'
import { LuLayoutGrid } from 'react-icons/lu'

export type AchievementId = 'letters' | 'reorder' | 'mail' | 'cv'

export interface Achievement {
  id:   AchievementId
  icon: ReactElement
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'letters', icon: <FaExplosion /> },
  { id: 'reorder', icon: <LuLayoutGrid /> },
  { id: 'mail',    icon: <TbMail /> },
  { id: 'cv',      icon: <TbFileText /> },
]

export { TbTrophy, FaStar, FaLock, FaCheck }


const STORAGE_KEY = 'portfolio_achievements'

function loadUnlocked(): Set<AchievementId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as AchievementId[]) : new Set()
  } catch {
    return new Set()
  }
}

interface AchievementsContextValue {
  achievements:  Achievement[]
  unlocked:      Set<AchievementId>
  unlock:        (id: AchievementId) => void
  toastQueue:    Achievement[]
  dismissToast:  () => void
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null)

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  // Lazy-init the ref once — avoids calling loadUnlocked() on every render
  const unlockedRef = useRef<Set<AchievementId> | null>(null)
  if (unlockedRef.current === null) unlockedRef.current = loadUnlocked()

  const [unlocked, setUnlocked]     = useState<Set<AchievementId>>(() => unlockedRef.current!)
  const [toastQueue, setToastQueue] = useState<Achievement[]>([])

  const unlock = useCallback((id: AchievementId) => {
    // Guard with the ref — no setState-inside-updater anti-pattern
    if (unlockedRef.current!.has(id)) return
    const next = new Set(unlockedRef.current!)
    next.add(id)
    unlockedRef.current = next
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch { /* noop */ }
    setUnlocked(new Set(next))
    const achievement = ACHIEVEMENTS.find(a => a.id === id)
    if (achievement) setToastQueue(q => [...q, achievement])
  }, [])

  const dismissToast = useCallback(() => {
    setToastQueue(q => q.slice(1))
  }, [])

  return (
    <AchievementsContext.Provider value={{ achievements: ACHIEVEMENTS, unlocked, unlock, toastQueue, dismissToast }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementsProvider')
  return ctx
}
