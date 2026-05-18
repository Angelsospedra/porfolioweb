import styles from './Tag.module.css'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
}

export function Tag({ children, variant = 'default' }: TagProps) {
  return (
    <span className={`${styles.tag} ${styles[variant]}`}>
      {children}
    </span>
  )
}
