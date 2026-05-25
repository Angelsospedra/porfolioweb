import { useState, useRef, useEffect, useCallback, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiHtml5, SiCss, SiAngular,
  SiTailwindcss, SiBootstrap, SiVite,
  SiGit, SiGithub, SiGitlab, SiFigma, SiSlack, SiNotion, SiJira, SiDavinciresolve,
} from 'react-icons/si'
import { VscSourceControl } from 'react-icons/vsc'
import { TbBrandTeams, TbBrandAzure, TbBrandAdobePhotoshop } from 'react-icons/tb'
import { skills, skillCategories } from '../../data/skills'
import { useInView } from '../../hooks/useInView'
import styles from './About.module.css'

const skillIcons: Record<string, ReactElement> = {
  'HTML5': <SiHtml5 />, 'CSS3': <SiCss />, 'React': <SiReact />,
  'Next.js': <SiNextdotjs />, 'TypeScript': <SiTypescript />, 'JavaScript': <SiJavascript />,
  'Angular': <SiAngular />, 'Tailwind CSS': <SiTailwindcss />, 'Bootstrap': <SiBootstrap />,
  'Vite': <SiVite />, 'Git': <SiGit />, 'GitHub': <SiGithub />, 'GitLab': <SiGitlab />,
  'Fork': <VscSourceControl />, 'Figma': <SiFigma />, 'Slack': <SiSlack />,
  'Azure': <TbBrandAzure />, 'Photoshop': <TbBrandAdobePhotoshop />,
  'DaVinci Resolve': <SiDavinciresolve />, 'Teams': <TbBrandTeams />,
  'Notion': <SiNotion />, 'Jira': <SiJira />,
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface CharData {
  char: string; x: number; y: number
  bold: boolean; color: string; fontSize: string
}
interface CharState {
  x: number; y: number; vx: number; vy: number
  rot: number; rotV: number; initialY: number
  launched: boolean; landed: boolean; bounces: number
}

export function About() {
  const { ref, inView } = useInView()
  const { t, i18n } = useTranslation()

  const bioRef        = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement | null>(null)
  const rafRef        = useRef<number | null>(null)
  const floatingRef   = useRef<HTMLDivElement>(null)
  const initialPosRef = useRef({ x: 0, y: 0 })
  const charsRef      = useRef<CharData[]>([])
  const spansRef      = useRef<HTMLSpanElement[]>([])
  const statesRef     = useRef<CharState[]>([])
  const launchedRef   = useRef<Set<number>>(new Set())
  const groundRef     = useRef(0)
  const isDraggingRef  = useRef(false)
  const isResettingRef = useRef(false)
  const didExplodeRef  = useRef(false)
  const cursorSpeedRef = useRef(0)
  const lastCursorRef  = useRef({ x: 0, y: 0 })

  const [exploded, setExploded] = useState(false)
  const [btnFading, setBtnFading] = useState(false)
  const [dragging, setDragging] = useState<{ icon: ReactElement } | null>(null)

  const stopAnim = () => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  const doCleanup = useCallback(() => {
    isDraggingRef.current  = false
    isResettingRef.current = false
    launchedRef.current    = new Set()
    charsRef.current       = []
    spansRef.current       = []
    statesRef.current      = []
    overlayRef.current?.remove()
    overlayRef.current = null
    if (bioRef.current) { bioRef.current.style.transition = ''; bioRef.current.style.opacity = '' }
    setExploded(false)
    setBtnFading(false)
    setDragging(null)
  }, [])

  const handleReset = useCallback((fadBtn = false) => {
    stopAnim()
    isDraggingRef.current  = false
    isResettingRef.current = true
    didExplodeRef.current  = false

    const spans = spansRef.current
    if (spans.length === 0) { doCleanup(); return }

    spans.forEach(span => {
      span.style.textShadow = 'none'
      span.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s 0.35s'
      span.style.transform  = 'translate(0px, 0px) rotate(0deg)'
      span.style.opacity    = '0'
    })

    if (bioRef.current) {
      bioRef.current.style.transition = 'opacity 0.2s 0.35s'
      bioRef.current.style.opacity    = '1'
    }

    if (fadBtn) setTimeout(() => setBtnFading(true), 480)
    setTimeout(doCleanup, fadBtn ? 780 : 580)
  }, [doCleanup])

  const handleResetClick = useCallback(() => {
    handleReset(true)
  }, [handleReset])

  useEffect(() => { handleReset() }, [i18n.language])
  useEffect(() => () => { stopAnim(); overlayRef.current?.remove() }, [])

  // Sync floating icon initial position after render
  useEffect(() => {
    if (dragging && floatingRef.current) {
      floatingRef.current.style.left = `${initialPosRef.current.x}px`
      floatingRef.current.style.top  = `${initialPosRef.current.y}px`
    }
  }, [dragging])

  // Physics loop — runs while dragging OR while chars still flying
  const animate = useCallback(() => {
    const GRAVITY = 0.5
    const GROUND  = groundRef.current
    let anyMoving = false

    launchedRef.current.forEach(i => {
      const s    = statesRef.current[i]
      const span = spansRef.current[i]
      if (!s || !span || s.landed) return

      s.vy += GRAVITY
      s.x  += s.vx
      s.y  += s.vy
      s.rot += s.rotV
      anyMoving = true

      const absY = s.initialY + s.y
      if (absY >= GROUND) {
        s.y    = GROUND - s.initialY
        s.vy  *= -0.18
        s.vx  *= 0.72
        s.rotV *= 0.45
        s.bounces++
        if (Math.abs(s.vy) < 1.5 || s.bounces > 3) {
          s.landed = true; s.vy = 0; s.vx = 0; s.rotV = 0
          const isLight = document.documentElement.getAttribute('data-theme') === 'light'
          span.style.textShadow = isLight
            ? '0 3px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.10)'
            : '0 6px 10px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.35)'
        }
      }
      span.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot}deg)`
    })

    if (anyMoving || isDraggingRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = null
    }
  }, [])

  // Launch a single character away from (cx, cy)
  const launchChar = useCallback((i: number, cx: number, cy: number) => {
    const c = charsRef.current[i]
    const s = statesRef.current[i]
    if (!c || !s || s.launched) return
    const dx   = (c.x + parseFloat(c.fontSize) * 0.3) - cx
    const dy   = (c.y + parseFloat(c.fontSize) * 0.5) - cy
    const dist = Math.max(12, Math.sqrt(dx * dx + dy * dy))
    const spd  = Math.max(3, Math.min(cursorSpeedRef.current * 0.9, 18)) + Math.random() * 4
    s.vx = (dx / dist) * spd * (0.8 + Math.random() * 0.4)
    s.vy = (dy / dist) * spd * (0.8 + Math.random() * 0.4) - Math.random() * 2
    s.rotV    = (Math.random() - 0.5) * (spd * 1.2)
    s.launched = true
    launchedRef.current.add(i)
  }, [])

  // Build overlay with one span per character, hiding original text
  const buildOverlay = useCallback(() => {
    if (!bioRef.current || overlayRef.current) return false
    const el     = bioRef.current
    const chars: CharData[] = []
    const sx = window.scrollX, sy = window.scrollY

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    let node: Text | null
    while ((node = walker.nextNode() as Text | null)) {
      const text     = node.textContent ?? ''
      const isBold   = node.parentElement?.tagName === 'STRONG'
      const paraEl   = node.parentElement?.closest('p')
      const pStyle   = paraEl ? window.getComputedStyle(paraEl) : window.getComputedStyle(el)
      for (let i = 0; i < text.length; i++) {
        const range = document.createRange()
        range.setStart(node, i); range.setEnd(node, i + 1)
        const rect = range.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) continue
        // Store document-space coordinates so spans survive scrolling
        chars.push({ char: text[i], x: rect.left + sx, y: rect.top + sy, bold: !!isBold, color: pStyle.color, fontSize: pStyle.fontSize })
      }
    }
    if (chars.length === 0) return false

    // Absolute overlay so children are in document space, not viewport
    const overlay = document.createElement('div')
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:9999;'
    document.body.appendChild(overlay)
    overlayRef.current = overlay

    const spans = chars.map(({ char, x, y, bold, color, fontSize }) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.cssText = `position:absolute;left:${x}px;top:${y}px;display:inline-block;font-family:Inter,system-ui,sans-serif;font-size:${fontSize};font-weight:${bold ? '700' : '400'};color:${color};white-space:pre;will-change:transform;`
      overlay.appendChild(span)
      return span
    })

    charsRef.current  = chars
    spansRef.current  = spans
    statesRef.current = chars.map(c => ({ x:0,y:0,vx:0,vy:0,rot:0,rotV:0, initialY:c.y, launched:false, landed:false, bounces:0 }))
    launchedRef.current = new Set()

    // Ground in document space — stop above section bottom padding
    const sEl = el.closest('section')
    const sRect = sEl?.getBoundingClientRect()
    const sPadBottom = sEl ? parseFloat(window.getComputedStyle(sEl).paddingBottom) : 64
    groundRef.current = sRect ? sRect.bottom + sy - sPadBottom - 8 : document.documentElement.scrollHeight - 12

    el.style.opacity = '0'
    return true
  }, [])

  const handleIconMouseDown = (e: React.MouseEvent, iconEl: ReactElement) => {
    if (isDraggingRef.current || isResettingRef.current) return
    e.preventDefault()
    initialPosRef.current = { x: e.clientX, y: e.clientY }
    // Build overlay on first pick-up; reuse on subsequent picks
    if (!overlayRef.current && !buildOverlay()) return
    isDraggingRef.current = true
    setDragging({ icon: iconEl })
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (!dragging) return
    document.body.style.cursor = 'grabbing'
    const RADIUS = 55

    const onMove = (e: MouseEvent) => {
      if (floatingRef.current) {
        floatingRef.current.style.left = `${e.clientX}px`
        floatingRef.current.style.top  = `${e.clientY}px`
      }
      const ddx = e.clientX - lastCursorRef.current.x
      const ddy = e.clientY - lastCursorRef.current.y
      cursorSpeedRef.current = Math.sqrt(ddx * ddx + ddy * ddy)
      lastCursorRef.current  = { x: e.clientX, y: e.clientY }
      const cursorDocX = e.clientX + window.scrollX
      const cursorDocY = e.clientY + window.scrollY
      let newLaunches = false
      charsRef.current.forEach((c, i) => {
        if (statesRef.current[i]?.launched) return
        const dx = c.x - cursorDocX
        const dy = c.y - cursorDocY
        if (dx * dx + dy * dy < RADIUS * RADIUS) {
          launchChar(i, cursorDocX, cursorDocY)
          newLaunches = true
        }
      })
      if (newLaunches && !didExplodeRef.current) {
        didExplodeRef.current = true
        setExploded(true)
      }
    }

    const onUp = () => {
      isDraggingRef.current = false
      document.body.style.cursor = ''
      setDragging(null)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
    }
  }, [dragging, launchChar])

  return (
    <section id="about" className={`section ${styles.about}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            className={styles.bio}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <p className="section-subtitle">{t('about.subtitle')}</p>
              <div className={styles.titleRow}>
                <h2 className="section-title">{t('about.title')} <span className="accent">{t('about.title_accent')}</span></h2>
                {exploded && (
                  <button className={`${styles.explodeBtn} ${btnFading ? styles.explodeBtnFading : ''}`} onClick={handleResetClick}>↺ Restablecer</button>
                )}
              </div>
            </motion.div>

            <div ref={bioRef}>
              <p>{t('about.p1')}</p>
              <p><Trans i18nKey="about.p2" components={{ strong: <strong /> }} /></p>
              <p><Trans i18nKey="about.p3" components={{ strong: <strong /> }} /></p>
            </div>
          </motion.div>

          <div className={styles.skills}>
            <p className={styles.skillHint}>{t('about.skill_hint')}</p>
            {skillCategories.map((cat, ci) => (
              <motion.div
                key={cat}
                className={styles.skillGroup}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + ci * 0.1 }}
              >
                <h3 className={styles.skillGroupTitle}>{t(`about.skills.${cat}`)}</h3>
                <ul className={styles.skillList}>
                  {skills.filter(s => s.category === cat).map((skill, i) => (
                    <motion.li
                      key={skill.name}
                      className={`${styles.skillItem} ${styles.draggable}`}
                      variants={fadeUp}
                      initial="hidden"
                      animate={inView ? 'visible' : 'hidden'}
                      custom={ci * 0.1 + i * 0.05}
                      onMouseDown={(e) => handleIconMouseDown(e, skillIcons[skill.name])}
                    >
                      <span className={styles.skillIcon}>{skillIcons[skill.name]}</span>
                      {skill.name}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {dragging && (
        <div ref={floatingRef} className={styles.floatingIcon}>
          {dragging.icon}
        </div>
      )}
    </section>
  )
}
