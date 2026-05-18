import { useTranslation } from 'react-i18next'
import { SiGithub, SiArtstation } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import styles from './Footer.module.css'

const SOCIAL: { icon: IconType; href: string; label: string }[] = [
  { icon: SiGithub, href: 'https://github.com/Angelsospedra', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/angel-sospedra/', label: 'LinkedIn' },
  { icon: SiArtstation, href: 'https://www.artstation.com/angelsospedra', label: 'ArtStation' },
]

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {t('footer.built_by')} <span className="accent">Ángel Sospedra Martínez</span>
        </p>
        <div className={styles.social}>
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialLink}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
