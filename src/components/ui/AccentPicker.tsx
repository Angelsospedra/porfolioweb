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
  const { accent, setAccent } = useAccent()
  const { unlocked } = useAchievements()

  const allUnlocked = ACHIEVEMENTS.every(a => unlocked.has(a.id))

  return (
    <div className={styles.wrapper}>
      <div className={styles.picker} role="group" aria-label="Accent color">
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
            aria-label="Legendario"
            aria-pressed={accent === 'yellow'}
            title="Legendario"
          />
        ) : (
          <button
            className={`${styles.dot} ${styles.locked}`}
            disabled
            aria-label="Color bloqueado — completa todos los logros"
            title="Completa todos los logros"
          />
        )}
      </div>
    </div>
  )
}
