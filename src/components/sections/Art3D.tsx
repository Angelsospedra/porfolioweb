import { useState, useRef, Suspense, Component, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Center } from '@react-three/drei'
import { useInView } from '../../hooks/useInView'
import { art3dItems, type Art3DItem } from '../../data/art3d'
import { MediaGallery, MediaViewer } from '../ui/MediaViewer'
import art3dStyles from './Art3D.module.css'
import viewerStyles from '../ui/MediaViewer.module.css'

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
      <div className={viewerStyles.spinner} />
    </Html>
  )
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? this.props.fallback : this.props.children }
}

// Visor especializado de Art3D que añade soporte de modelo 3D sobre el visor genérico
function Art3DViewer({ model, onClose }: { model: Art3DItem; onClose: () => void }) {
  const hasModel = !!model.model
  const hasMedia = !!model.video || !!model.images?.length

  if (!hasModel) {
    // Sin modelo 3D: usa directamente el visor genérico
    return (
      <MediaViewer
        title={model.title}
        description={model.description}
        video={model.video}
        images={model.images}
        onClose={onClose}
        footer={model.link ? (
          <a
            href={model.link}
            target="_blank"
            rel="noopener noreferrer"
            className={art3dStyles.artstationLink}
          >
            Ver en ArtStation ↗
          </a>
        ) : undefined}
      />
    )
  }

  // Con modelo 3D: modal personalizado con Canvas
  const fallback = hasMedia
    ? <MediaGallery video={model.video} images={model.images} />
    : <div className={viewerStyles.noContent}>Sin previsualización disponible</div>

  return (
    <motion.div
      className={viewerStyles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={viewerStyles.modal}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <div className={viewerStyles.modalHeader}>
          <div className={viewerStyles.modalTitleRow}>
            <h3 className={viewerStyles.modalTitle}>{model.title}</h3>
            <button className={viewerStyles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
          <p className={viewerStyles.modalDesc}>{model.description}</p>
        </div>

        <div className={viewerStyles.contentWrap}>
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
            <p className={art3dStyles.canvasHint}>Arrastra para rotar · Scroll para zoom · Clic central para panear</p>
          </ModelErrorBoundary>
        </div>

        {model.link && (
          <div className={viewerStyles.modalFooter}>
            <a
              href={model.link}
              target="_blank"
              rel="noopener noreferrer"
              className={art3dStyles.artstationLink}
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
    <section id="art3d" className={`section ${art3dStyles.art3d}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">También soy</p>
          <h2 className="section-title">Artista <span className="accent">3D</span></h2>
        </motion.div>

        <div className={art3dStyles.carouselWrap}>
          <div className={art3dStyles.track} ref={trackRef}>
            {art3dItems.map((item, i) => (
              <motion.article
                key={item.id}
                className={art3dStyles.card}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setActive(item)}
              >
                <div className={art3dStyles.thumb}>
                  <img src={item.thumb} alt={item.title} loading="lazy" />
                  <div className={art3dStyles.thumbOverlay}>
                    <span className={art3dStyles.viewIcon}>⬡</span>
                    <span className={art3dStyles.viewLabel}>{item.model ? 'Ver modelo 3D' : 'Ver galería'}</span>
                  </div>
                </div>
                <div className={art3dStyles.cardBody}>
                  <span className={art3dStyles.year}>{item.year}</span>
                  <h4 className={art3dStyles.cardTitle}>{item.title}</h4>
                  <p className={art3dStyles.cardDesc}>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && <Art3DViewer model={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
