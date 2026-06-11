import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronUp, ChevronDown, Lock, Unlock } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TbTrophy } from 'react-icons/tb'
import { projects as initialProjects } from '../../data/projects'
import type { Project, ProjectMedia } from '../../types'
import { useInView } from '../../hooks/useInView'
import { useAchievements } from '../../context/AchievementsContext'
import { MediaViewer } from '../ui/MediaViewer'
import styles from './Projects.module.css'

// ── Carousel slide ───────────────────────────────────────────────────────────

function CarouselSlide({ media, onLoad }: { media: ProjectMedia; onLoad: () => void }) {
  const base = import.meta.env.BASE_URL
  const [loaded, setLoaded] = useState(false)

  const handleLoad = () => { setLoaded(true); onLoad() }

  if (media.type === 'video') {
    return (
      <div className={styles.slideWrapper}>
        <video
          src={`${base}${media.src.replace(/^\//, '')}`}
          className={`${styles.carouselVideo} ${loaded ? styles.mediaLoaded : styles.mediaHidden}`}
          controls
          muted
          playsInline
          preload="metadata"
          width={media.width}
          height={media.height}
          style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
          onLoadedMetadata={handleLoad}
        />
      </div>
    )
  }

  return (
    <div className={styles.slideWrapper}>
      <img
        src={`${base}${media.src.replace(/^\//, '')}`}
        alt=""
        className={`${styles.carouselImage} ${loaded ? styles.mediaLoaded : styles.mediaHidden}`}
        onLoad={handleLoad}
      />
    </div>
  )
}

// ── Media Carousel ───────────────────────────────────────────────────────────

function MediaCarousel({ project }: { project: Project }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const mediaItems = project.media ?? []

  useEffect(() => { setCurrentIndex(0); setIsLoaded(false) }, [project.id])

  if (!mediaItems.length) return null

  const count = mediaItems.length
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < count - 1
  const showControls = count > 1

  const firstVideo = mediaItems.find(m => m.type === 'video' && m.width && m.height)
  const isPortrait = firstVideo ? firstVideo.height! > firstVideo.width! : false

  return (
    <div className={`${styles.carousel} ${isPortrait ? styles.carouselCentered : ''}`}>
      {!isLoaded && <div className={styles.carouselSpinner} />}
      <div className={styles.carouselTrack}>
        <div className={styles.carouselSlide}>
          <CarouselSlide
            key={`${project.id}-${currentIndex}`}
            media={mediaItems[currentIndex]}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>

      {showControls && (
        <div className={styles.carouselControls}>
          <button
            className={`${styles.carouselArrow} ${!hasPrev ? styles.carouselArrowDisabled : ''}`}
            onClick={() => { if (hasPrev) { setIsLoaded(false); setCurrentIndex(i => i - 1) } }}
            aria-label="Anterior"
            disabled={!hasPrev}
          >
            <ChevronUp size={18} />
          </button>

          <div className={styles.carouselDots}>
            {mediaItems.map((_, i) => (
              <button
                key={i}
                className={`${styles.carouselDot} ${i === currentIndex ? styles.carouselDotActive : ''}`}
                onClick={() => { setIsLoaded(false); setCurrentIndex(i) }}
                aria-label={`Ir al elemento ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={`${styles.carouselArrow} ${!hasNext ? styles.carouselArrowDisabled : ''}`}
            onClick={() => { if (hasNext) { setIsLoaded(false); setCurrentIndex(i => i + 1) } }}
            aria-label="Siguiente"
            disabled={!hasNext}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Project list item ────────────────────────────────────────────────────────

function ProjectListItem({
  project,
  isSelected,
  onClick,
}: {
  project: Project
  isSelected: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const base = import.meta.env.BASE_URL

  return (
    <button
      className={`${styles.listItem} ${isSelected ? styles.listItemSelected : ''}`}
      onClick={onClick}
    >
      {project.thumb && (
        <img
          src={`${base}${project.thumb.replace(/^\//, '')}`}
          alt=""
          className={styles.listItemThumb}
          draggable={false}
        />
      )}
      <div className={styles.listItemOverlay} />
      {isSelected && <div className={styles.listItemActiveLine} />}
      {project.logo && (
        <img
          src={`${base}${project.logo.replace(/^\//, '')}`}
          alt=""
          className={styles.listItemLogo}
          draggable={false}
        />
      )}
      <div className={styles.listItemContent}>
        <span className={styles.listItemTitle}>
          {t(`project_items.${project.id}.title`)}
        </span>
      </div>
      <div className={styles.listItemTags}>
        {project.tags.map(tag => (
          <span key={tag} className={styles.listItemTag}>{tag}</span>
        ))}
      </div>
    </button>
  )
}

// ── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableProjectListItem({
  project,
  isSelected,
  onClick,
}: {
  project: Project
  isSelected: boolean
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })

  return (
    <div
      ref={setNodeRef}
      className={styles.sortableItem}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <ProjectListItem project={project} isSelected={isSelected} onClick={onClick} />
    </div>
  )
}

// ── Projects section ─────────────────────────────────────────────────────────

export function Projects() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()

  const [orderedProjects, setOrderedProjects] = useState(initialProjects)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [selectedId, setSelectedId] = useState(initialProjects[0].id)
  const [mobileViewerOpen, setMobileViewerOpen] = useState(false)
  const selectedProject = orderedProjects.find(p => p.id === selectedId) ?? orderedProjects[0]

  function handleProjectClick(id: number) {
    setSelectedId(id)
    if (window.innerWidth <= 900) {
      setMobileViewerOpen(true)
    }
  }

  const { unlock } = useAchievements()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart() {
    document.documentElement.style.scrollSnapType = 'none'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }

  function handleDragEnd(event: DragEndEvent) {
    document.documentElement.style.scrollSnapType = ''
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    const { active, over } = event
    if (over && active.id !== over.id) {
      setOrderedProjects(items => {
        const oldIndex = items.findIndex(p => p.id === active.id)
        const newIndex = items.findIndex(p => p.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      unlock('reorder')
    }
  }

  function handleDragCancel() {
    document.documentElement.style.scrollSnapType = ''
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
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
              {isUnlocked && (
                <span className={styles.dragHint}>
                  <TbTrophy />
                  {t('projects.drag_hint')}
                </span>
              )}
              <button
                className={`${styles.unlockBtn} ${isUnlocked ? styles.unlockBtnActive : ''}`}
                onClick={() => setIsUnlocked(u => !u)}
                aria-label={isUnlocked ? 'Bloquear orden' : 'Reordenar proyectos'}
              >
                {isUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                {isUnlocked ? t('projects.lock') : t('projects.unlock')}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.layout}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Izquierda: lista de proyectos */}
          <div className={styles.projectListWrapper}>
            {isUnlocked ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} autoScroll={false} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
                <SortableContext items={orderedProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <nav className={styles.projectList} aria-label="Proyectos">
                    {orderedProjects.map(project => (
                      <SortableProjectListItem
                        key={project.id}
                        project={project}
                        isSelected={project.id === selectedId}
                        onClick={() => handleProjectClick(project.id)}
                      />
                    ))}
                  </nav>
                </SortableContext>
              </DndContext>
            ) : (
              <nav className={styles.projectList} aria-label="Proyectos">
                {orderedProjects.map(project => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isSelected={project.id === selectedId}
                    onClick={() => handleProjectClick(project.id)}
                  />
                ))}
              </nav>
            )}
          </div>

          {/* Derecha: carrusel */}
          <div className={styles.projectDetail}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                style={{ width: '100%' }}
              >
                <MediaCarousel project={selectedProject} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Visor fullscreen mobile — usa el mismo MediaViewer que la sección 3D */}
      <AnimatePresence>
        {mobileViewerOpen && (() => {
          const base = import.meta.env.BASE_URL
          const videoItem = selectedProject.media?.find(m => m.type === 'video')
          const videoSrc = videoItem ? `${base}${videoItem.src.replace(/^\//, '')}` : undefined
          const imageSrcs = selectedProject.media
            ?.filter(m => m.type === 'image')
            .map(m => `${base}${m.src.replace(/^\//, '')}`)
          return (
            <MediaViewer
              title={t(`project_items.${selectedProject.id}.title`)}
              description={t(`project_items.${selectedProject.id}.description`)}
              video={videoSrc}
              images={imageSrcs}
              onClose={() => setMobileViewerOpen(false)}
            />
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
