import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SiArtstation } from 'react-icons/si'
import { IconGithub, IconLinkedin } from '../ui/icons/BrandIcons'
import { SOCIAL_LINKS } from '../../data/social'
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

const TILT_MAX = 3
const spring = { stiffness: 200, damping: 20, mass: 0.5 }

function SplitText({ text, className, waveOffset = 0 }: { text: string; className?: string; waveOffset?: number }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [waving, setWaving] = useState(false)

  useEffect(() => {
    const handler = () => {
      const duration = (waveOffset + text.length - 1) * 70 + 800
      setTimeout(() => {
        setWaving(true)
        setTimeout(() => setWaving(false), duration)
      }, 1000)
    }
    window.addEventListener('welcome-dismissed', handler)
    return () => window.removeEventListener('welcome-dismissed', handler)
  }, [text.length, waveOffset])

  return (
    <span className={className}>
      {text.split('').map((char, i) => {
        const isHovered = hovered === i
        const x = hovered === null ? 0 : i < hovered ? -3 : i > hovered ? 3 : 0
        return (
          <motion.span
            key={i}
            style={{ display: 'inline-block' }}
            animate={{ scale: isHovered ? 1.07 : 1, x, y: waving ? [0, -8, 0] : 0 }}
            transition={{
              scale: { type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              x: { type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              y: waving
                ? { duration: 0.7, delay: (waveOffset + i) * 0.07, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 },
            }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
          >
            {char}
          </motion.span>
        )
      })}
    </span>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const { unlock } = useAchievements()
  const cardRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, spring)
  const rotateY = useSpring(rawY, spring)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    rawX.set(dy * TILT_MAX)
    rawY.set(-dx * TILT_MAX)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <section className={styles.hero}>
      <div className={styles.gradient} aria-hidden />
      <div className={`container ${styles.layout}`}>
        <div
          ref={cardRef}
          className={styles.imageWrapper}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.img
            src={`${import.meta.env.BASE_URL}angel.png`}
            alt="Ángel Sospedra"
            className={styles.photo}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY }}
          />
        </div>

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
            <SplitText text="Ángel" className={styles.nameLine} waveOffset={0} />
            <span className={styles.nameLine}>
              <SplitText text="Sospedra" waveOffset={5} />
              {' '}
              <SplitText text="Martínez" waveOffset={13} />
            </span>
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
              <a href={SOCIAL_LINKS[0].href} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[0].label} className={styles.socialIcon}>
                <IconGithub size={23} />
              </a>
              <a href={SOCIAL_LINKS[1].href} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[1].label} className={styles.socialIcon}>
                <IconLinkedin size={20} />
              </a>
              <a href={SOCIAL_LINKS[2].href} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LINKS[2].label} className={styles.socialIcon}>
                <SiArtstation size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
