export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
}

export interface Skill {
  name: string
  category: 'frontend' | 'tools'
}

export interface NavLink {
  label: string
  href: string
}
