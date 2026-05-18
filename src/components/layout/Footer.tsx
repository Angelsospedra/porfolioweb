import { useTranslation } from 'react-i18next'
import { IconGithub, IconLinkedin, IconArtstation } from '../ui/icons/BrandIcons'
import styles from './Footer.module.css'

const SOCIAL = [
  { icon: IconGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: IconLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: IconArtstation, href: 'https://www.artstation.com/angelsospedra', label: 'ArtStation' },
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
