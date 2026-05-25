import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SiArtstation } from 'react-icons/si'
import { IconGithub, IconLinkedin } from '../ui/icons/BrandIcons'
import { Button } from '../ui/Button'
import { useAchievements } from '../../context/AchievementsContext'
import styles from './Hero.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  const { t } = useTranslation()
  const { unlock } = useAchievements()

  return (
    <section className={styles.hero}>
      <div className={styles.gradient} aria-hidden />
      <div className={`container ${styles.layout}`}>
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={`${import.meta.env.BASE_URL}angel.png`} alt="Ángel Sospedra" className={styles.photo} />
        </motion.div>

        {/* Saludo + nombre — junto a la foto en móvil */}
        <div className={styles.nameContent}>
          <motion.p
            className={styles.greeting}
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            {t('hero.greeting')}
          </motion.p>

          <motion.h1
            className={styles.name}
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
          >
            <span className={styles.nameLine}>Ángel</span>
            <span className={styles.nameLine}>Sospedra Martínez</span>
          </motion.h1>
        </div>

        {/* Rol, bio y botones — ancho completo centrado en móvil */}
        <div className={styles.bodyContent}>
          <motion.h2
            className={styles.role}
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeUp}
          >
            {t('hero.role')}
          </motion.h2>

          <motion.p
            className={styles.bio}
            initial="hidden"
            animate="visible"
            custom={0.3}
            variants={fadeUp}
          >
            {t('hero.bio')}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeUp}
          >
            <Button as="a" href="#projects" size="lg">
              {t('hero.cta_projects')}
            </Button>
            <Button as="a" href="#contact" variant="outline" size="lg">
              {t('hero.cta_contact')}
            </Button>
            <Button
              as="a"
              href={`${import.meta.env.BASE_URL}CV.pdf`}
              download
              variant="ghost"
              size="lg"
              className={styles.cvBtn}
              onClick={() => unlock('cv')}
            >
              ↓ {t('hero.cta_cv')}
            </Button>
            <div className={styles.socialLinks}>
              <a href="https://github.com/Angelsospedra" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.socialIcon}>
                <IconGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/angel-sospedra/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
                <IconLinkedin size={20} />
              </a>
              <a href="https://www.artstation.com/angelsospedra" target="_blank" rel="noopener noreferrer" aria-label="ArtStation" className={styles.socialIcon}>
                <SiArtstation size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
