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
