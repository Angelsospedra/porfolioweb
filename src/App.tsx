import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Projects } from './components/sections/Projects'
import { Journey } from './components/sections/Journey'
import { Contact } from './components/sections/Contact'
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
