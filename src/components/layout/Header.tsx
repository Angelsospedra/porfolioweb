import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { LangSwitcher } from '../ui/LangSwitcher'
import { AccentPicker } from '../ui/AccentPicker'
import styles from './Header.module.css'

const NAV_HREFS = ['#about', '#projects', '#contact'] as const
const NAV_KEYS = ['header.about', 'header.projects', 'header.contact'] as const

export function Header() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  const navLinks = NAV_HREFS.map((href, i) => ({ href, label: t(NAV_KEYS[i]) }))

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo} aria-label="Go to top">
          <span className={styles.logoBracket}>&lt;</span>
          Ángel
          <span className={styles.logoBracket}>/&gt;</span>
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Main navigation">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className={styles.navLink} onClick={handleNavClick}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <LangSwitcher />
          <ThemeToggle />
          <AccentPicker />
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu} aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className={styles.mobileLink} onClick={handleNavClick}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
