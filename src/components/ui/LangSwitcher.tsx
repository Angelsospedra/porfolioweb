import { useTranslation } from 'react-i18next'
import styles from './LangSwitcher.module.css'

const LANGS = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'va', label: 'VAL' },
]

export function LangSwitcher() {
  const { i18n } = useTranslation()

  const change = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Language selector">
      {LANGS.map((lang, i) => (
        <span key={lang.code} className={styles.item}>
          <button
            className={`${styles.btn} ${i18n.language === lang.code ? styles.active : ''}`}
            onClick={() => change(lang.code)}
            aria-pressed={i18n.language === lang.code}
          >
            {lang.label}
          </button>
          {i < LANGS.length - 1 && <span className={styles.sep} aria-hidden>|</span>}
        </span>
      ))}
    </div>
  )
}
