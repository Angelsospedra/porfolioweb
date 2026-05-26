import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 4,
    title: 'Proyecto Vivir PWA',
    description: '',
    tags: ['React', 'PWA', 'Mobile Web App', 'Next.js'],
    featured: true,
    thumb: '/thumbs/proyectos/pv.png',
    media: [
      { type: 'video', src: '/videos/pv.mp4', poster: '/thumbs/proyectos/pv.png', objectPosition: 'center 47%' },
    ],
  },
  {
    id: 1,
    title: 'VP',
    description: '',
    tags: ['React', 'Next.js', 'Multi-tenant', 'Stripe'],
    featured: true,
    thumb: '/thumbs/proyectos/vp.png',
    media: [
      { type: 'video', src: '/videos/vp.mp4', poster: '/thumbs/proyectos/vp.png' },
    ],
  },
  {
    id: 2,
    title: 'Fitmap',
    description: '',
    tags: ['PWA', 'JavaScript', 'PHP', 'MySQL', 'Stripe'],
    featured: true,
    thumb: '/thumbs/proyectos/fitmap.png',
    media: [
      { type: 'video', src: '/videos/fitmap.mp4', poster: '/thumbs/proyectos/fitmap.png' },
    ],
  },
  {
    id: 3,
    title: 'Vinilocos',
    description: '',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    featured: true,
    thumb: '/thumbs/proyectos/vinilocos.png',
    media: [
      { type: 'video', src: '/videos/vinilocos.mp4', poster: '/thumbs/proyectos/vinilocos.png' },
    ],
  },
]
