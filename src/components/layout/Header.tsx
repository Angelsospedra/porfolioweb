import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { LangSwitcher } from '../ui/LangSwitcher'
import { AccentPicker } from '../ui/AccentPicker'
import { AchievementsDropdown } from '../ui/AchievementsDropdown'
import { useAchievements, ACHIEVEMENTS } from '../../context/AchievementsContext'
import styles from './Header.module.css'

const NAV_HREFS = ['#about', '#projects', '#journey', '#art3d', '#contact'] as const
const NAV_KEYS = ['header.about', 'header.projects', 'header.journey', 'header.art3d', 'header.contact'] as const

export function Header() {
  const { t } = useTranslation()
  const { unlocked } = useAchievements()
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [glowing,    setGlowing]    = useState(false)

  const allUnlocked    = ACHIEVEMENTS.every(a => unlocked.has(a.id))
  const prevUnlockedRef = useRef(allUnlocked)  // true on load if already completed

  useEffect(() => {
    // Fire only when the state flips false → true (last achievement unlocked this session)
    if (allUnlocked && !prevUnlockedRef.current) {
      setGlowing(true)
      const t = setTimeout(() => setGlowing(false), 2200)
      return () => clearTimeout(t)
    }
    prevUnlockedRef.current = allUnlocked
  }, [allUnlocked])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  const navLinks = NAV_HREFS.map((href, i) => ({ href, label: t(NAV_KEYS[i]) }))

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${glowing ? styles.legendaryGlow : ''}`}>
        <div className={styles.inner}>
          <a href="#" className={styles.logo} aria-label="Go to top">
            <span className={styles.logoBracket}>&lt;</span>
            Ángel
            <span className={styles.logoBracket}>/&gt;</span>
          </a>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className={styles.actions}>
            <AchievementsDropdown />
            <LangSwitcher />
            <ThemeToggle />
            <AccentPicker />
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu — portal para salir del stacking context del header */}
      {menuOpen && createPortal(
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className={styles.mobileLink} onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles.mobileTools}>
            <LangSwitcher />
            <ThemeToggle />
            <AccentPicker />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
