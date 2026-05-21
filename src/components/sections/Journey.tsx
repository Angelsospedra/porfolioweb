import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useInView } from '../../hooks/useInView'
import styles from './Journey.module.css'

interface JourneyItem {
  year: string
  title: string
  place: string
  description: string
}

export function Journey() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()

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
          <h2 className="section-title">
            {t('journey.title')} <span className="accent">{t('journey.title_accent')}</span>
          </h2>
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
                  <div className={styles.dot} />
                  <div className={styles.card}>
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
