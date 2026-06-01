import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRef, useState, useCallback, useEffect } from 'react'
import { TbTrophy } from 'react-icons/tb'
import { useInView } from '../../hooks/useInView'
import { useAchievements } from '../../context/AchievementsContext'
import styles from './Journey.module.css'

interface JourneyItem {
  year: string
  title: string
  place: string
  description: string
}

// [keyword, note-file, solfa, english]
const NOTE_ENTRIES: [string, string, string, string][] = [
  ['ceremon',   'C4', 'Do',  'C'],
  ['tsmr',      'D4', 'Re',  'D'],
  ['polygonal', 'E4', 'Mi',  'E'],
  ['startgo',   'G4', 'Sol', 'G'],
  ['master',    'A4', 'La',  'A'],
  ['conmuta',   'B4', 'Si',  'B'],
  ['daw',       'C5', 'Do',  'C'],
  ['3d',        'F4', 'Fa',  'F'],
]

function getNoteForItem(title: string, place: string, lang: string): [string, string] | null {
  const haystack = (title + ' ' + place).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const isEn = lang.startsWith('en')
  for (const [kw, noteFile, solfa, en] of NOTE_ENTRIES) {
    if (haystack.includes(kw)) return [noteFile, isEn ? en : solfa]
  }
  return null
}

interface PianoNote {
  release: () => void
  stop:    () => void
}

let _audioCtx: AudioContext | null = null
const _bufferCache = new Map<string, AudioBuffer>()

function getAudioCtx(): AudioContext {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return _audioCtx
}

async function loadBuffer(path: string): Promise<void> {
  if (_bufferCache.has(path)) return
  try {
    const ctx = getAudioCtx()
    const res = await fetch(path)
    const arr = await res.arrayBuffer()
    const buf = await ctx.decodeAudioData(arr)
    _bufferCache.set(path, buf)
  } catch { /* file missing, skip silently */ }
}

function startPianoNote(buffer: AudioBuffer): PianoNote {
  const ctx = getAudioCtx()
  const src = ctx.createBufferSource()
  src.buffer = buffer

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.8, ctx.currentTime)
  src.connect(gain)
  gain.connect(ctx.destination)
  src.start()

  let done = false
  const fade = (timeConstant: number, stopDelay: number) => {
    if (done) return
    done = true
    const t = ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.setTargetAtTime(0, t, timeConstant)
    try { src.stop(t + stopDelay) } catch { /* already stopped */ }
    setTimeout(() => { try { gain.disconnect() } catch {} }, stopDelay * 1000 + 100)
  }

  return {
    release: () => fade(0.3, 1.5),    // natural piano release
    stop:    () => fade(0.004, 0.03),  // near-instant cut, no clipping
  }
}

const LOGOS: Record<string, { match: string; src: string; alt: string }[]> = {
  education: [
    { match: 'Florida',  src: `${import.meta.env.BASE_URL}logos/florida.png`,  alt: 'La Florida' },
    { match: 'Progresa', src: `${import.meta.env.BASE_URL}logos/progresa.png`, alt: 'Progresa'   },
    { match: 'mara',     src: `${import.meta.env.BASE_URL}logos/camara.png`,   alt: 'Cámara FP'  },
  ],
  work: [
    { match: 'ceremon',  src: `${import.meta.env.BASE_URL}logos/grupoceremon.png`, alt: 'Grupo Ceremón'      },
    { match: 'polygonal', src: `${import.meta.env.BASE_URL}logos/pm.png`,         alt: 'Polygonal Mind'     },
    { match: 'startgo',  src: `${import.meta.env.BASE_URL}logos/startgo.png`,    alt: 'StartGo Connection' },
    { match: 'conmuta',  src: `${import.meta.env.BASE_URL}logos/conmuta.png`,    alt: 'Conmuta Soluciones' },
  ],
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getLogo(groupKey: string, field: string) {
  const n = normalize(field)
  return LOGOS[groupKey]?.find(l => n.includes(normalize(l.match))) ?? null
}

export function Journey() {
  const { ref, inView } = useInView()
  const { t, i18n } = useTranslation()
  const { unlock } = useAchievements()
  const [activeNote, setActiveNote] = useState<{ id: string; label: string } | null>(null)
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteRef = useRef<PianoNote | null>(null)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    NOTE_ENTRIES.forEach(([, noteFile]) => loadBuffer(`${base}piano/${noteFile}.mp3`))
  }, [])

  const handlePointerDown = useCallback((itemId: string, title: string, place: string) => {
    if (window.matchMedia('(max-width: 900px)').matches) return
    const note = getNoteForItem(title, place, i18n.language)
    if (!note) return
    const [noteFile, label] = note
    const buffer = _bufferCache.get(`${import.meta.env.BASE_URL}piano/${noteFile}.mp3`)
    if (!buffer) return
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    if (noteRef.current) noteRef.current.stop()
    noteRef.current = startPianoNote(buffer)
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current)
    setActiveNote({ id: itemId, label })
    unlock('melody')
  }, [i18n.language, unlock])

  const handlePointerUp = useCallback(() => {
    if (!noteRef.current) return
    noteRef.current.release()
    noteRef.current = null
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current)
    noteTimerRef.current = setTimeout(() => setActiveNote(null), 1000)
  }, [])

  const education = t('journey.education', { returnObjects: true }) as JourneyItem[]
  const work = t('journey.work', { returnObjects: true }) as JourneyItem[]

  const groups = [
    { key: 'education', label: t('journey.education_label'), items: education },
    { key: 'work', label: t('journey.work_label'), items: work },
  ]

  return (
    <section id="journey" className={`section ${styles.journey}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">{t('journey.subtitle')}</p>
          <div className={styles.titleRow}>
            <h2 className="section-title">
              {t('journey.title')} <span className="accent">{t('journey.title_accent')}</span>
            </h2>
            <div className={styles.pianoHintRow}>
              <span className={styles.pianoIcon}><TbTrophy /></span>
              <p className={styles.pianoHint}>{t('journey.piano_hint')}</p>
            </div>
          </div>
        </motion.div>

        {groups.map((group, gi) => (
          <div key={group.key} className={styles.group}>
            <motion.h3
              className={styles.groupLabel}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + gi * 0.35 }}
            >
              {group.label}
            </motion.h3>

            <div className={styles.timeline}>
              {group.items.map((item, i) => (
                <motion.div
                  key={i}
                  className={styles.item}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + gi * 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`${styles.dot} ${activeNote?.id === `${group.key}-${i}` ? styles.dotHidden : ''}`} />
                  <AnimatePresence>
                    {activeNote?.id === `${group.key}-${i}` && (
                      <div className={styles.noteLabelAnchor}>
                        <motion.span
                          key="note"
                          className={styles.noteLabel}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.15 }}
                        >
                          {activeNote.label}
                        </motion.span>
                      </div>
                    )}
                  </AnimatePresence>
                  <div
                    className={styles.card}
                    onPointerDown={() => handlePointerDown(`${group.key}-${i}`, item.title, item.place)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{ cursor: getNoteForItem(item.title, item.place, i18n.language) ? 'pointer' : undefined }}
                  >
                    {(() => {
                      const logo = getLogo(group.key, item.place + ' ' + item.title)
                      return logo ? (
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className={styles.schoolLogo}
                        />
                      ) : null
                    })()}
                    <span className={styles.year}>{item.year}</span>
                    <h4 className={styles.cardTitle}>{item.title}</h4>
                    <p className={styles.place}>{item.place}</p>
                    <p className={styles.description}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
