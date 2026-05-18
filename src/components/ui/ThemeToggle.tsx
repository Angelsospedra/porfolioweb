import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Moon size={14} className={`${styles.icon} ${theme === 'dark' ? styles.iconActive : ''}`} />
      <span className={styles.track}>
        <span className={`${styles.thumb} ${theme === 'light' ? styles.thumbLight : ''}`} />
      </span>
      <Sun size={14} className={`${styles.icon} ${theme === 'light' ? styles.iconActive : ''}`} />
    </button>
  )
}
