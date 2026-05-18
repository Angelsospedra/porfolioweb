import type { Skill } from '../types'

export const skills: Skill[] = [
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'HTML5', category: 'frontend' },
  { name: 'CSS3', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Git', category: 'tools' },
  { name: 'Vite', category: 'tools' },
  { name: 'Figma', category: 'tools' },
  { name: 'npm / yarn', category: 'tools' },
  { name: 'REST APIs', category: 'other' },
  { name: 'SEO técnico', category: 'other' },
  { name: 'Responsive Design', category: 'other' },
  { name: 'Marketplaces', category: 'other' },
]

export const skillCategories = ['frontend', 'tools', 'other'] as const
