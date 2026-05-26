import { useTranslation } from 'react-i18next'
import { FaLock } from 'react-icons/fa6'
import { useAccent, type Accent } from '../../context/AccentContext'
import { useAchievements, ACHIEVEMENTS } from '../../context/AchievementsContext'
import styles from './AccentPicker.module.css'

const accents: { value: Accent; color: string }[] = [
  { value: 'green',  color: '#6ee7b7' },
  { value: 'red',    color: '#f87171' },
  { value: 'blue',   color: '#60a5fa' },
  { value: 'purple', color: '#9690fc' },
]

export function AccentPicker() {
  const { t } = useTranslation()
  const { accent, setAccent } = useAccent()
  const { unlocked } = useAchievements()

  const allUnlocked = ACHIEVEMENTS.every(a => unlocked.has(a.id))

  return (
    <div className={styles.wrapper}>
      <div className={styles.picker} role="group" aria-label={t('accent.group_label')}>
        {accents.map(a => (
          <button
            key={a.value}
            className={`${styles.dot} ${accent === a.value ? styles.active : ''}`}
            style={{ '--dot-color': a.color } as React.CSSProperties}
            onClick={() => setAccent(a.value)}
            aria-label={a.value}
            aria-pressed={accent === a.value}
          />
        ))}

        {/* ── Legendary yellow ── */}
        {allUnlocked ? (
          <button
            className={`${styles.dot} ${styles.legendary} ${accent === 'yellow' ? styles.active : ''}`}
            onClick={() => setAccent('yellow')}
            aria-label={t('accent.legendary')}
            aria-pressed={accent === 'yellow'}
            title={t('accent.legendary')}
          />
        ) : (
          <span
            className={styles.lockedIcon}
            aria-label={t('accent.locked')}
            title={t('accent.locked_short')}
          >
            <FaLock />
          </span>
        )}
      </div>
    </div>
  )
}
