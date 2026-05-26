import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TbTrophy } from 'react-icons/tb'
import { LangSwitcher } from './LangSwitcher'
import styles from './WelcomeModal.module.css'

const STORAGE_KEY = 'portfolio_welcomed'

export function WelcomeModal() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY) && window.innerWidth > 768) setVisible(true)
  }, [])

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, x: '-50%', y: 'calc(-50% + 24px)' }}
            animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
            exit={{    opacity: 0, scale: 0.92,  x: '-50%', y: 'calc(-50% + 24px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
          >
            <div className={styles.titleRow}>
              <h2 id="welcome-title" className={styles.title}>
                {t('welcome.title')}
              </h2>
              <LangSwitcher />
            </div>

            <p className={styles.body}>{t('welcome.body')}</p>

            <p className={styles.hint}>
              <TbTrophy className={styles.hintIcon} />
              {t('welcome.achievements_hint')}
            </p>

            <button className={styles.btn} onClick={handleClose}>
              {t('welcome.cta')}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
