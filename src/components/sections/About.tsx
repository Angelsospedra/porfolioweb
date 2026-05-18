import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { skills, skillCategories } from '../../data/skills'
import { Tag } from '../ui/Tag'
import { useInView } from '../../hooks/useInView'
import styles from './About.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function About() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()

  return (
    <section id="about" className={`section ${styles.about}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">{t('about.subtitle')}</p>
          <h2 className="section-title">{t('about.title')} <span className="accent">{t('about.title_accent')}</span></h2>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.bio}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>{t('about.p1')}</p>
            <p><Trans i18nKey="about.p2" components={{ strong: <strong /> }} /></p>
            <p><Trans i18nKey="about.p3" components={{ strong: <strong /> }} /></p>
          </motion.div>

          <div className={styles.skills}>
            {skillCategories.map((cat, ci) => (
              <motion.div
                key={cat}
                className={styles.skillGroup}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + ci * 0.1 }}
              >
                <h3 className={styles.skillGroupTitle}>{t(`about.skills.${cat}`)}</h3>
                <div className={styles.tagCloud}>
                  {skills
                    .filter(s => s.category === cat)
                    .map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        variants={fadeUp}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        custom={ci * 0.1 + i * 0.05}
                      >
                        <Tag variant={cat === 'frontend' ? 'accent' : 'default'}>
                          {skill.name}
                        </Tag>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
