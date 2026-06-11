export interface ProjectMedia {
  type: 'image' | 'video'
  src: string
  poster?: string
  objectPosition?: string
  width?: number
  height?: number
}

export interface Project {
  id: number
  title: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  thumb?: string
  logo?: string
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
