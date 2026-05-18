import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')

  if (Tag === 'a') {
    const { href, target, rel, ...rest } = props as ButtonProps
    return (
      <a href={href} target={target} rel={rel} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
