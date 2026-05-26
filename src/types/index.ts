export interface ProjectMedia {
  type: 'image' | 'video'
  src: string
  poster?: string        // sólo para vídeos
  objectPosition?: string // encuadre del preview en la tarjeta, ej: 'center 40%'
}

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  thumb?: string
  media?: ProjectMedia[] // si vacío, se usa thumb como imagen
}

export interface Skill {
  name: string
  category: 'frontend' | 'tools'
}

export interface NavLink {
  label: string
  href: string
}
