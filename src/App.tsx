import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Journey } from './components/sections/Journey'
import { Art3D } from './components/sections/Art3D'
import { Contact } from './components/sections/Contact'
import { AchievementsProvider } from './context/AchievementsContext'
import { AchievementToast } from './components/ui/AchievementToast'
import { WelcomeModal } from './components/ui/WelcomeModal'

function App() {
  // Scroll suave para los clics en links internos
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return

      e.preventDefault()
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        history.replaceState(null, '', ' ')
        return
      }
      const target = document.getElementById(href.slice(1))
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <AchievementsProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Art3D />
        <Contact />
      </main>
      <Footer />
      <AchievementToast />
      <WelcomeModal />
    </AchievementsProvider>
  )
}

export default App
