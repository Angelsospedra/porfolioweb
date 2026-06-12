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
import { ChatBot } from './components/ui/ChatBot'

function App() {
  // Scroll-behavior:smooth global se quitó para que el snap de rueda sea
  // instantáneo (Chrome lo animaba). El desplazamiento suave se conserva solo
  // para los clics de navegación interna mediante este handler delegado.
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

  // Navegación por rueda: un giro = una sección, instantáneo e idéntico en todos
  // los navegadores (Chrome con CSS scroll-snap hacía scroll parcial y luego
  // enganchaba). Respeta el scroll interno de overlays/listas y se apaga en móvil.
  useEffect(() => {
    const HEADER_OFFSET = 70
    let locked = false
    let timer: ReturnType<typeof setTimeout>

    function unlock() { locked = false }

    // ¿Hay un ancestro con scroll propio que aún puede desplazarse en esa dirección?
    function hasScrollableAncestor(node: HTMLElement | null, dir: number): boolean {
      let el = node
      while (el && el !== document.body) {
        const oy = getComputedStyle(el).overflowY
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
          if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
          if (dir < 0 && el.scrollTop > 1) return true
        }
        el = el.parentElement
      }
      return false
    }

    function onWheel(e: WheelEvent) {
      // Desactivado en móvil (el snap ya está apagado) y durante zoom con ctrl.
      if (window.innerWidth <= 768 || e.ctrlKey) return
      // Overlay/menú abierto que bloquea el scroll del documento.
      if (document.documentElement.style.overflow === 'hidden') return
      if (document.body.style.overflow === 'hidden') return
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      if (!dir) return
      // No secuestrar el scroll interno de ChatBot, MediaViewer, dropdowns, etc.
      if (hasScrollableAncestor(e.target as HTMLElement, dir)) return

      if (locked) { e.preventDefault(); return }

      const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'))
      if (!sections.length) return

      const snapPos = (s: HTMLElement) =>
        Math.max(0, s.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET)

      // Sección actual: aquella cuya posición de snap es la más cercana al scroll.
      const y = window.scrollY
      let idx = 0
      let best = Infinity
      sections.forEach((s, i) => {
        const d = Math.abs(snapPos(s) - y)
        if (d < best) { best = d; idx = i }
      })

      const target = sections[idx + dir]
      // En los extremos (subir desde la primera / bajar tras la última, p. ej. al
      // footer) dejamos el scroll nativo.
      if (!target) return

      e.preventDefault()
      locked = true
      window.scrollTo({ top: snapPos(target), behavior: 'smooth' })
      clearTimeout(timer)
      timer = setTimeout(unlock, 700)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scrollend', unlock)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scrollend', unlock)
      clearTimeout(timer)
    }
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
      <ChatBot />
    </AchievementsProvider>
  )
}

export default App
