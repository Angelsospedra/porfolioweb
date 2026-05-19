import { useAccent, type Accent } from '../../context/AccentContext'
import styles from './AccentPicker.module.css'

const accents: { value: Accent; color: string }[] = [
  { value: 'green',  color: '#6ee7b7' },
  { value: 'red',    color: '#f87171' },
  { value: 'blue',   color: '#60a5fa' },
  { value: 'purple', color: '#c084fc' },
]

export function AccentPicker() {
  const { accent, setAccent } = useAccent()

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
      </div>
    </div>
  )
}
