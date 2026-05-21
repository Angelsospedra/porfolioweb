import { useState, useRef, useEffect, Suspense, Component, type ReactNode } from 'react'
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
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const block = () => { if (document.fullscreenElement) document.exitFullscreen() }
    v.addEventListener('fullscreenchange', block)
    return () => v.removeEventListener('fullscreenchange', block)
  }, [])

  return (
    <video
      ref={ref}
      className={styles.galleryImg}
      src={src}
      controls
      controlsList="nofullscreen nodownload noremoteplayback"
      disablePictureInPicture
      autoPlay
      loop
      playsInline
      onDoubleClick={e => e.preventDefault()}
    />
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
  return (
    <div className={styles.gallery}>
      {video && (
        <div className={styles.gallerySlide}>
          <NoFullscreenVideo src={video} />
        </div>
      )}
      {images?.map((src, i) => (
        <GalleryImage key={i} src={src} />
      ))}
    </div>
  )
}

function Viewer({ model, onClose }: { model: Art3DItem; onClose: () => void }) {
  const hasModel  = !!model.model
  const hasMedia  = !!model.video || !!model.images?.length
  const [use3D] = useState(hasModel)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
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
          <div>
            <h3 className={styles.modalTitle}>{model.title}</h3>
            <p className={styles.modalDesc}>{model.description}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
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
