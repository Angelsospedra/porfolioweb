import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAchievements, type Achievement } from '../../context/AchievementsContext'
import styles from './AchievementToast.module.css'

const DURATION = 4500

// ── Single toast card ────────────────────────────────────────────────────────
function Toast({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  const { t } = useTranslation()

  // Keep a stable ref so the timer never gets cancelled by a reference change
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    const t = setTimeout(() => dismissRef.current(), DURATION)
    return () => clearTimeout(t)
  }, [achievement.id]) // only re-arm if a different achievement appears

  return (
    <motion.div
      className={styles.toast}
      initial={{ x: '130%', opacity: 0 }}
      animate={{ x: 0,      opacity: 1 }}
      exit={{    x: '130%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    >
      <div className={styles.iconBox}>
        <span>{achievement.icon}</span>
      </div>

      <div className={styles.content}>
        <span className={styles.label}>{t('achievements.toast_label')}</span>
        <span className={styles.title}>{t(`achievements.${achievement.id}.title`)}</span>
      </div>

      {/* countdown bar */}
      <motion.div
        className={styles.progress}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: DURATION / 1000, ease: 'linear' }}
      />
    </motion.div>
  )
}

// ── Container (reads queue from context) ────────────────────────────────────
export function AchievementToast() {
  const { toastQueue, dismissToast } = useAchievements()
  const current = toastQueue[0]

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {current && (
          <Toast key={current.id} achievement={current} onDismiss={dismissToast} />
        )}
      </AnimatePresence>
    </div>
  )
}
