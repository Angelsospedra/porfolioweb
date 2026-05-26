import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { ExternalLink, Lock, Unlock } from 'lucide-react'
import { IconGithub } from '../ui/icons/BrandIcons'
import { projects as initialProjects } from '../../data/projects'
import type { Project } from '../../types'
import { useInView } from '../../hooks/useInView'
import { useAchievements } from '../../context/AchievementsContext'
import { MediaViewer } from '../ui/MediaViewer'
import styles from './Projects.module.css'

// ── Tarjeta ─────────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  locked,
  trembleDelay,
  onCardClick,
}: {
  project: Project
  locked: boolean
  trembleDelay: number
  onCardClick: () => void
}) {
  const { t } = useTranslation()
  const videoRef   = useRef<HTMLVideoElement>(null)
  const timerRef   = useRef<number | null>(null)
  const [previewing, setPreviewing] = useState(false)

  const videoMedia = project.media?.find(m => m.type === 'video')
  const videoSrc   = videoMedia?.src

  const handleMouseEnter = useCallback(() => {
    if (!videoSrc) return
    // Empieza a cargar el vídeo inmediatamente, así el segundo de espera sirve de buffer
    if (videoRef.current) videoRef.current.load()
    timerRef.current = window.setTimeout(() => {
      setPreviewing(true)
      videoRef.current?.play().catch(() => {})
    }, 1000)
  }, [videoSrc])

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    setPreviewing(false)
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <article
      className={[
        styles.card,
        project.featured ? styles.featured : '',
        locked ? styles.locked : styles.trembling,
      ].join(' ')}
      style={!locked ? { animationDelay: `-${trembleDelay}ms` } : undefined}
      onClick={locked ? onCardClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Área imagen */}
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
        {videoSrc && (
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}${videoSrc.replace(/^\//, '')}`}
            className={`${styles.cardPreviewVideo} ${previewing ? styles.cardPreviewVideoVisible : ''}`}
            style={videoMedia?.objectPosition ? { objectPosition: videoMedia.objectPosition } : undefined}
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="none"
          />
        )}

        {/* Título arriba */}
        <div className={styles.cardImageTop}>
          <div className={styles.cardTitleRow}>
            <div className={styles.cardDot} aria-hidden />
            <h3 className={styles.title}>{t(`project_items.${project.id}.title`)}</h3>
          </div>
          <div className={styles.cardLinks}>
            {locked ? (
              /* Icono de vista cuando está bloqueada */
              <span className={styles.viewHint} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </span>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Descripción */}
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

// ── Tarjeta sortable ─────────────────────────────────────────────────────────

function SortableCard({
  project,
  locked,
  trembleDelay,
  onCardClick,
}: {
  project: Project
  locked: boolean
  trembleDelay: number
  onCardClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled: locked,
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  })

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(${isDragging ? 1.05 : 1})` : undefined,
    transition: isDragging ? 'transform 0s' : transition,
    cursor: locked ? 'pointer' : isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 50 : 'auto',
    boxShadow: isDragging ? '0 20px 48px rgba(0,0,0,0.5)' : undefined,
    borderRadius: isDragging ? 12 : undefined,
    position: 'relative',
    height: '100%',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(locked ? {} : listeners)}
    >
      <ProjectCard
        project={project}
        locked={locked}
        trembleDelay={trembleDelay}
        onCardClick={onCardClick}
      />
    </div>
  )
}

// ── Sección Proyectos ────────────────────────────────────────────────────────

export function Projects() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()
  const { unlock } = useAchievements()

  const [items, setItems] = useState(initialProjects)
  const [locked, setLocked] = useState(true)
  const [viewerProject, setViewerProject] = useState<Project | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleUnlock = useCallback(() => setLocked(false), [])
  const handleLock   = useCallback(() => setLocked(true),  [])

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
            <h2 className="section-title">
              {t('projects.title')} <span className="accent">{t('projects.title_accent')}</span>
            </h2>
            <div className={styles.titleActions}>
              {!locked && (
                <p className={styles.dragHint}>{t('projects.drag_hint')}</p>
              )}
              <button
                className={`${styles.unlockBtn} ${locked ? styles.unlockBtnLocked : styles.unlockBtnUnlocked}`}
                onClick={locked ? handleUnlock : handleLock}
                aria-label={locked ? t('projects.unlock') : t('projects.lock')}
              >
                {locked
                  ? <><Lock size={14} /><span>{t('projects.unlock')}</span></>
                  : <><Unlock size={14} /><span>{t('projects.lock')}</span></>
                }
              </button>
            </div>
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
                {items.map((project, index) => (
                  <SortableCard
                    key={project.id}
                    project={project}
                    locked={locked}
                    trembleDelay={(index * 73) % 200}
                    onCardClick={() => setViewerProject(project)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </motion.div>
      </div>

      {/* Visor de media */}
      <AnimatePresence>
        {viewerProject && (() => {
          const mediaImages = viewerProject.media
            ?.filter(m => m.type === 'image')
            .map(m => `${import.meta.env.BASE_URL}${m.src.replace(/^\//, '')}`)
          const mediaVideoSrc = viewerProject.media?.find(m => m.type === 'video')?.src
          const mediaVideo = mediaVideoSrc
            ? `${import.meta.env.BASE_URL}${mediaVideoSrc.replace(/^\//, '')}`
            : undefined

          const images = mediaImages?.length ? mediaImages : undefined

          return (
            <MediaViewer
              key={viewerProject.id}
              title={t(`project_items.${viewerProject.id}.title`)}
              description={t(`project_items.${viewerProject.id}.description`)}
              video={mediaVideo}
              images={images}
              onClose={() => setViewerProject(null)}
            />
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
