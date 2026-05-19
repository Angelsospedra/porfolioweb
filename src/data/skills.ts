import type { Skill } from '../types'

export const skills: Skill[] = [
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'Angular', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Bootstrap', category: 'frontend' },
  { name: 'Vite', category: 'frontend' },
  { name: 'Git', category: 'tools' },
  { name: 'GitHub', category: 'tools' },
  { name: 'GitLab', category: 'tools' },
  { name: 'Fork', category: 'tools' },
  { name: 'Figma', category: 'tools' },
  { name: 'Slack', category: 'tools' },
  { name: 'Teams', category: 'tools' },
  { name: 'Notion', category: 'tools' },
  { name: 'Jira', category: 'tools' },
]

export const skillCategories = ['frontend', 'tools'] as const
