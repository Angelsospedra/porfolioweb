import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAchievements, ACHIEVEMENTS, TbTrophy, FaStar, FaLock, FaCheck } from '../../context/AchievementsContext'
import styles from './AchievementsDropdown.module.css'

export function AchievementsDropdown() {
  const { unlocked } = useAchievements()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const count   = ACHIEVEMENTS.filter(a => unlocked.has(a.id)).length
  const total   = ACHIEVEMENTS.length
  const allDone = count === total

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Trigger ── */}
      <button
        className={`${styles.trigger} ${allDone ? styles.triggerComplete : ''}`}
        onClick={() => setOpen(true)}
        aria-label={t('achievements.trigger_label')}
        title={t('achievements.trigger_label')}
      >
        <span className={styles.triggerIcon}><TbTrophy /></span>
        <span className={styles.triggerCount}>
          {count}<span className={styles.triggerTotal}>/{total}</span>
        </span>
      </button>

      {/* ── Panel (portal) ── */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
              />

              {/* Drawer */}
              <motion.aside
                className={styles.panel}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                aria-label={t('achievements.panel_aria')}
              >
                {/* Header */}
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>
                    <span><TbTrophy /></span>
                    <span>{t('achievements.panel_title')}</span>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label={t('common.close')}>
                    <X size={18} />
                  </button>
                </div>

                {/* Progress */}
                <div className={styles.progress}>
                  <div className={styles.progressLabels}>
                    <span>{t('achievements.progress', { count, total })}</span>
                    <span>{Math.round((count / total) * 100)}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={`${styles.progressFill} ${allDone ? styles.progressFillComplete : ''}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / total) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* Achievement list */}
                <div className={styles.panelBody}>
                {(['pending', 'done'] as const).map(group => {
                  const items = ACHIEVEMENTS.filter(a => group === 'done' ? unlocked.has(a.id) : !unlocked.has(a.id))
                  if (items.length === 0) return null
                  return (
                    <div key={group}>
                      <p className={styles.groupLabel}>
                        {t(group === 'done' ? 'achievements.group_done' : 'achievements.group_pending')}
                      </p>
                      <ul className={styles.list}>
                        {items.map((a, i) => {
                          const done = group === 'done'
                          return (
                            <motion.li
                              key={a.id}
                              className={`${styles.item} ${done ? styles.itemDone : styles.itemLocked}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className={`${styles.itemIcon} ${done ? styles.itemIconDone : ''}`}>
                                {a.icon}
                              </div>
                              <div className={styles.itemBody}>
                                <div className={styles.itemTitleRow}>
                                  <span className={styles.itemTitle}>{t(`achievements.${a.id}.title`)}</span>
                                  <span className={styles.itemBadge}>{done ? <FaCheck /> : <FaLock />}</span>
                                </div>
                                <p className={styles.itemHint}>
                                  {done
                                    ? t(`achievements.${a.id}.description`)
                                    : t(`achievements.${a.id}.hint`)}
                                </p>
                              </div>
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
                </div>

                {/* Legendary footer */}
                {allDone && (
                  <motion.div
                    className={styles.footer}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className={styles.footerGlow}><FaStar /></span>
                    <span>{t('achievements.legendary_footer')}</span>
                  </motion.div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
