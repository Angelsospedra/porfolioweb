import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LangSwitcher.module.css'

const LANGS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'va', label: 'Valencià' },
]

export function LangSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGS.find(l => l.code === i18n.language) ?? LANGS[0]

  const change = async (code: string) => {
    if (code === i18n.language) { setOpen(false); return }
    setOpen(false)

    const main = document.querySelector('main') as HTMLElement | null
    if (main) {
      main.style.transition = 'opacity 0.18s ease'
      main.style.opacity    = '0'
      await new Promise<void>(r => setTimeout(r, 180))
    }

    await i18n.changeLanguage(code)
    localStorage.setItem('lang', code)

    if (main) {
      // Wait one paint so React has flushed the new text into the DOM
      requestAnimationFrame(() => {
        main.style.opacity = '1'
        setTimeout(() => { main.style.transition = '' }, 200)
      })
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className={open ? styles.chevronOpen : styles.chevron}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {LANGS.map(lang => (
            <li key={lang.code} role="option" aria-selected={lang.code === i18n.language}>
              <button
                className={`${styles.option} ${lang.code === i18n.language ? styles.optionActive : ''}`}
                onClick={() => change(lang.code)}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
