import { useState, useRef, useEffect, useCallback, Suspense, Component, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Center } from '@react-three/drei'
import { useInView } from '../../hooks/useInView'
import { art3dItems, type Art3DItem } from '../../data/art3d'
import styles from './Art3D.module.css'

function ModelLoader({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

function Spinner() {
  return (
    <Html center>
      <div className={styles.spinner} />
    </Html>
  )
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? this.props.fallback : this.props.children }
}

function NoFullscreenVideo({ src }: { src: string }) {
  const ref         = useRef<HTMLVideoElement>(null)
  const rafRef      = useRef<number | null>(null)
  const progressRef = useRef<HTMLInputElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted]     = useState(true)
  const [duration, setDuration] = useState(0)

  const tick = useCallback(() => {
    const v = ref.current; const bar = progressRef.current
    if (v && bar) bar.value = String(v.currentTime)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [tick])

  const toggle = useCallback(() => {
    const v = ref.current; if (!v) return
    playing ? v.pause() : v.play()
    setPlaying(p => !p)
  }, [playing])

  const toggleMute = useCallback(() => {
    const v = ref.current; if (!v) return
    v.muted = !v.muted
    setMuted(m => !m)
  }, [])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = ref.current; if (!v) return
    v.currentTime = Number(e.target.value)
  }, [])

  return (
    <div className={styles.videoWrap}>
      <video
        ref={ref}
        className={styles.galleryImg}
        src={src}
        autoPlay
        loop
        playsInline
        muted
        disablePictureInPicture
        onLoadedMetadata={() => setDuration(ref.current?.duration ?? 0)}
        onClick={toggle}
      />
      <div className={styles.videoControls}>
        <button className={styles.videoBtn} onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          {playing
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>
          }
        </button>
        <input
          ref={progressRef}
          className={styles.videoProgress}
          type="range" min={0} max={duration || 1} step={0.01}
          defaultValue={0} onChange={seek}
        />
        <button className={styles.videoBtn} onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {muted
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l2 2L21 18.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          }
        </button>
      </div>
    </div>
  )
}

function GalleryImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={styles.gallerySlide}>
      {!loaded && <div className={styles.imgSpinner} />}
      <img
        src={src}
        alt=""
        className={styles.galleryImg}
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

function MediaGallery({ video, images }: { video?: string; images?: string[] }) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [canUp, setCanUp]     = useState(false)
  const [canDown, setCanDown] = useState(false)

  const total = (video ? 1 : 0) + (images?.length ?? 0)

  const updateArrows = useCallback(() => {
    const el = galleryRef.current; if (!el) return
    setCanUp(el.scrollTop > 10)
    setCanDown(el.scrollTop < el.scrollHeight - el.clientHeight - 10)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = galleryRef.current; if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [updateArrows])

  const scrollTo = (dir: 'up' | 'down') => {
    const el = galleryRef.current; if (!el) return
    const h = el.clientHeight
    el.scrollBy({ top: dir === 'down' ? h : -h, behavior: 'smooth' })
  }

  return (
    <div className={styles.galleryWrap}>
      <div className={styles.gallery} ref={galleryRef}>
        {video && (
          <div className={styles.gallerySlide}>
            <NoFullscreenVideo src={video} />
          </div>
        )}
        {images?.map((src, i) => (
          <GalleryImage key={i} src={src} />
        ))}
      </div>
      {total > 1 && (
        <>
          <button className={`${styles.galleryArrow} ${styles.galleryArrowUp}`} onClick={() => scrollTo('up')} aria-label="Anterior" disabled={!canUp}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button className={`${styles.galleryArrow} ${styles.galleryArrowDown}`} onClick={() => scrollTo('down')} aria-label="Siguiente" disabled={!canDown}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </>
      )}
    </div>
  )
}

function Viewer({ model, onClose }: { model: Art3DItem; onClose: () => void }) {
  const hasModel  = !!model.model
  const hasMedia  = !!model.video || !!model.images?.length
  const [use3D] = useState(hasModel)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  const fallback = hasMedia
    ? <MediaGallery video={model.video} images={model.images} />
    : <div className={styles.noContent}>Sin previsualización disponible</div>

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <h3 className={styles.modalTitle}>{model.title}</h3>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
          <p className={styles.modalDesc}>{model.description}</p>
        </div>

        <div className={styles.canvasWrap}>
          {use3D ? (
            <ModelErrorBoundary fallback={<>{hasMedia ? <MediaGallery video={model.video} images={model.images} /> : fallback}</>}>
              <Canvas camera={{ position: [5, 2, 5], fov: 40 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[15, 20, 15]} intensity={1} />
                <directionalLight position={[-12, 5, -8]} intensity={0.5} />
                <Suspense fallback={<Spinner />}>
                  <ModelLoader url={model.model} />
                  <Environment preset="studio" environmentIntensity={0.7} />
                </Suspense>
                <OrbitControls enablePan mouseButtons={{ LEFT: 0, MIDDLE: 2, RIGHT: 2 }} minDistance={1} maxDistance={10} />
              </Canvas>
              <p className={styles.canvasHint}>Arrastra para rotar · Scroll para zoom · Clic central para panear</p>
            </ModelErrorBoundary>
          ) : fallback}
        </div>

        {model.link && (
          <div className={styles.modalFooter}>
            <a
              href={model.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.artstationLink}
            >
              Ver en ArtStation ↗
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function Art3D() {
  const { ref, inView } = useInView()
  const [active, setActive] = useState<Art3DItem | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  if (art3dItems.length === 0) return null

  return (
    <section id="art3d" className={`section ${styles.art3d}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">También soy</p>
          <h2 className="section-title">Artista <span className="accent">3D</span></h2>
        </motion.div>

        <div className={styles.carouselWrap}>
          <div className={styles.track} ref={trackRef}>
            {art3dItems.map((item, i) => (
              <motion.article
                key={item.id}
                className={styles.card}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setActive(item)}
              >
                <div className={styles.thumb}>
                  <img src={item.thumb} alt={item.title} loading="lazy" />
                  <div className={styles.thumbOverlay}>
                    <span className={styles.viewIcon}>⬡</span>
                    <span className={styles.viewLabel}>{item.model ? 'Ver modelo 3D' : 'Ver galería'}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.year}>{item.year}</span>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && <Viewer model={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
