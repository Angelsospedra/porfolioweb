import { useTranslation } from 'react-i18next'
import { SiGithub, SiArtstation } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { SOCIAL_LINKS } from '../../data/social'
import styles from './Footer.module.css'

const ICONS: Record<string, IconType> = {
  GitHub: SiGithub,
  LinkedIn: FaLinkedin,
  ArtStation: SiArtstation,
}

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {t('footer.built_by')} <a href="#" className={`accent ${styles.nameLink}`}>Ángel Sospedra Martínez</a>
        </p>
        <div className={styles.social}>
          {SOCIAL_LINKS.map(({ label, href }) => {
            const Icon = ICONS[label]
            return (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialLink}>
                <Icon size={18} />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
