import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Lock, Unlock } from 'lucide-react'
import { TbTrophy } from 'react-icons/tb'
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
  const cardRef      = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const timerRef     = useRef<number | null>(null)
  const idleTimerRef = useRef<number | null>(null)
  const [previewing, setPreviewing]     = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [progress, setProgress]         = useState(0)

  const videoMedia = project.media?.find(m => m.type === 'video')
  const videoSrc   = videoMedia?.src

  const handleMouseEnter = useCallback(() => {
    if (!videoSrc || !locked) return
    if (videoRef.current) videoRef.current.load()
    timerRef.current = window.setTimeout(() => {
      setPreviewing(true)
      videoRef.current?.play().catch(() => {})
    }, 500)
  }, [videoSrc])

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current)     { clearTimeout(timerRef.current);   timerRef.current = null }
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null }
    setPreviewing(false)
    setShowControls(false)
    setProgress(0)
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }, [])

  // Detener el vídeo si la tarjeta se desbloquea mientras está reproduciéndose
  useEffect(() => {
    if (!locked && previewing) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
      setPreviewing(false)
      setShowControls(false)
      setProgress(0)
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    }
  }, [locked, previewing])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (v && v.duration) setProgress(v.currentTime / v.duration)
  }, [])

  // Listeners nativos para evitar quirks de eventos sintéticos de React
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onMove = (e: MouseEvent) => {
      if (!videoRef.current || videoRef.current.paused) return
      if (e.movementX === 0 && e.movementY === 0) return
      setShowControls(true)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = window.setTimeout(() => setShowControls(false), 2000)
    }

    const onLeave = () => {
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null }
      setShowControls(false)
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Mostrar la barra al arrancar el vídeo
  useEffect(() => {
    if (!previewing) return
    setShowControls(true)
    idleTimerRef.current = window.setTimeout(() => setShowControls(false), 2000)
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current) }
  }, [previewing])

  useEffect(() => () => {
    if (timerRef.current)     clearTimeout(timerRef.current)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
  }, [])

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
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
            onTimeUpdate={handleTimeUpdate}
          />
        )}
        {videoSrc && (
          <div className={`${styles.videoProgress} ${showControls ? styles.videoProgressVisible : ''}`}>
            <div className={styles.videoProgressFill} style={{ width: `${progress * 100}%` }} />
          </div>
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
      duration: 350,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  })

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition,
    cursor: locked ? 'pointer' : 'grab',
    position: 'relative',
    height: '100%',
    willChange: transform ? 'transform' : 'auto',
    backfaceVisibility: 'hidden',
    opacity: isDragging ? 0 : 1,
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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const activeProject = activeId ? items.find(p => p.id === String(activeId)) ?? null : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    document.body.style.cursor = activeId ? 'grabbing' : ''
    return () => { document.body.style.cursor = '' }
  }, [activeId])

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveId(null)
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
              <div className={`${styles.dragHintRow} ${locked ? styles.dragHintHidden : ''}`}>
                <TbTrophy className={styles.dragHintTrophy} aria-hidden />
                <p className={styles.dragHint}>{t('projects.drag_hint')}</p>
              </div>
              <button
                className={`${styles.unlockBtn} ${locked ? styles.unlockBtnLocked : styles.unlockBtnUnlocked}`}
                onClick={locked ? handleUnlock : handleLock}
                aria-label={locked ? t('projects.unlock') : t('projects.lock')}
              >
                {locked ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{locked ? t('projects.unlock') : t('projects.lock')}</span>
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
            onDragStart={handleDragStart}
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
            <DragOverlay dropAnimation={null}>
              {activeProject ? (
                <div style={{ height: '100%', transform: 'scale(1.05)', boxShadow: '0 20px 48px rgba(0,0,0,0.5)', borderRadius: 12 }}>
                  <ProjectCard
                    project={activeProject}
                    locked={false}
                    trembleDelay={0}
                    onCardClick={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
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
