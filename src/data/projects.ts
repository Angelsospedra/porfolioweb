import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 1,
    title: 'VP',
    tags: ['React', 'Next.js', 'Multi-tenant', 'Stripe'],
    featured: true,
    thumb: '/thumbs/proyectos/vp.png',
    logo: '/thumbs/proyectos/logo/vp-logo.png',
    media: [
      { type: 'video', src: '/videos/vp.mp4', width: 1920, height: 1080 },
      { type: 'image', src: '/images/VP/1.png' },
      { type: 'image', src: '/images/VP/2.png' },
      { type: 'image', src: '/images/VP/3.png' },
      { type: 'image', src: '/images/VP/4.png' },
    ],
  },
  {
    id: 4,
    title: 'Proyecto Vivir PWA',
    tags: ['React', 'PWA', 'Mobile Web App', 'Vite', 'Firebase'],
    featured: true,
    thumb: '/thumbs/proyectos/pv.png',
    logo: '/thumbs/proyectos/logo/pv-logo.png',
    media: [
      { type: 'video', src: '/videos/pv.mp4', objectPosition: 'center 47%', width: 1080, height: 2340 },
      { type: 'image', src: '/images/PV/1.png' },
      { type: 'image', src: '/images/PV/2.png' },
      { type: 'image', src: '/images/PV/3.png' },
    ],
  },
  {
    id: 2,
    title: 'Fitmap',
    tags: ['PWA', 'JavaScript', 'PHP', 'MySQL'],
    featured: true,
    thumb: '/thumbs/proyectos/fitmap.png',
    logo: '/thumbs/proyectos/logo/FitMap-logo.png',
    media: [
      { type: 'video', src: '/videos/fitmap.mp4', width: 1080, height: 2340 },
      { type: 'image', src: '/images/Fitmap/1.png' },
      { type: 'image', src: '/images/Fitmap/2.png' },
      { type: 'image', src: '/images/Fitmap/3.png' },
    ],
  },
  {
    id: 3,
    title: 'Vinilocos',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    featured: true,
    thumb: '/thumbs/proyectos/vinilocos.png',
    logo: '/thumbs/proyectos/logo/vinilocos-logo.png',
    media: [
      { type: 'video', src: '/videos/vinilocos.mp4', width: 1920, height: 1080 },
      { type: 'image', src: '/images/Vinilocos/1.png' },
      { type: 'image', src: '/images/Vinilocos/2.png' },
      { type: 'image', src: '/images/Vinilocos/3.png' },
    ],
  },
]
