import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowDown } from 'lucide-react'
import { IconGithub, IconLinkedin } from '../ui/icons/BrandIcons'
import { Button } from '../ui/Button'
import styles from './Hero.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.gradient} aria-hidden />
      <div className={`container ${styles.content}`}>
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
          <div className={styles.socialLinks}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={styles.socialIcon}>
              <IconGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
              <IconLinkedin size={20} />
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#about"
          className={styles.scroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          aria-label="Scroll down"
        >
          <ArrowDown size={18} />
        </motion.a>
      </div>
    </section>
  )
}
