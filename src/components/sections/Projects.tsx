import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { IconGithub } from '../ui/icons/BrandIcons'
import { projects as initialProjects } from '../../data/projects'
import type { Project } from '../../types'
import { useInView } from '../../hooks/useInView'
import { useAchievements } from '../../context/AchievementsContext'
import styles from './Projects.module.css'

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation()

  return (
    <article className={`${styles.card} ${project.featured ? styles.featured : ''}`}>
      {/* Área imagen: título arriba + tags abajo */}
      <div className={styles.cardImageArea}>
        {project.thumb && (
          <>
            <img
              src={`${import.meta.env.BASE_URL}${project.thumb.replace(/^\//, '')}`}
              alt={`${t(`project_items.${project.id}.title`)} preview`}
              className={styles.cardThumb}
              draggable={false}
            />
            <div className={styles.cardOverlay} aria-hidden />
          </>
        )}

        {/* Título encima de la imagen */}
        <div className={styles.cardImageTop}>
          <div className={styles.cardTitleRow}>
            <div className={styles.cardDot} aria-hidden />
            <h3 className={styles.title}>{t(`project_items.${project.id}.title`)}</h3>
          </div>
          <div className={styles.cardLinks}>
            <div className={styles.dragDots} aria-hidden />
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className={styles.link}>
                <IconGithub size={17} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className={styles.link}>
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Descripción fuera de la imagen */}
      <div className={styles.cardBody}>
        <div className={styles.description}>
          <p>{t(`project_items.${project.id}.description`)}</p>
          <ul className={styles.featureList}>
            {(t(`project_items.${project.id}.features`, { returnObjects: true }) as string[]).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

function SortableCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  })

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(${isDragging ? 1.05 : 1})` : undefined,
    transition: isDragging ? 'transform 0s' : transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 50 : 'auto',
    boxShadow: isDragging ? '0 20px 48px rgba(0,0,0,0.5)' : undefined,
    borderRadius: isDragging ? 12 : undefined,
    position: 'relative',
    height: '100%',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectCard project={project} />
    </div>
  )
}

export function Projects() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()
  const { unlock } = useAchievements()
  const [items, setItems] = useState(initialProjects)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(p => p.id === active.id)
        const newIndex = prev.findIndex(p => p.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
      unlock('reorder')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(p => p.id === active.id)
        const newIndex = prev.findIndex(p => p.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <section id="projects" className={`section ${styles.projects}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">{t('projects.subtitle')}</p>
          <div className={styles.titleRow}>
            <h2 className="section-title">{t('projects.title')} <span className="accent">{t('projects.title_accent')}</span></h2>
            <p className={styles.dragHint}>{t('projects.drag_hint')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(p => p.id)} strategy={rectSortingStrategy}>
              <div className={styles.grid}>
                {items.map(project => (
                  <SortableCard key={project.id} project={project} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </motion.div>
      </div>
    </section>
  )
}
