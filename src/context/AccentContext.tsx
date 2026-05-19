import { createContext, useContext, useEffect, useState } from 'react'

export type Accent = 'green' | 'red' | 'blue' | 'purple'

interface AccentContextType {
  accent: Accent
  setAccent: (a: Accent) => void
}

const AccentContext = createContext<AccentContextType | undefined>(undefined)

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<Accent>(() =>
    (localStorage.getItem('accent') as Accent) ?? 'green'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent)
    localStorage.setItem('accent', accent)
  }, [accent])

  const setAccent = (a: Accent) => setAccentState(a)

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  )
}

export function useAccent() {
  const ctx = useContext(AccentContext)
  if (!ctx) throw new Error('useAccent must be used inside AccentProvider')
  return ctx
}
