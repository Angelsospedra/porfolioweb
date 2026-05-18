import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { IconGithub } from '../ui/icons/BrandIcons'
import { projects } from '../../data/projects'
import { Tag } from '../ui/Tag'
import { useInView } from '../../hooks/useInView'
import styles from './Projects.module.css'

export function Projects() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()

  return (
    <section id="projects" className={`section ${styles.projects}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">{t('projects.subtitle')}</p>
          <h2 className="section-title">{t('projects.title')} <span className="accent">{t('projects.title_accent')}</span></h2>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              className={`${styles.card} ${project.featured ? styles.featured : ''}`}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardTitleRow}>
                  <div className={styles.cardDot} aria-hidden />
                  <h3 className={styles.title}>{t(`project_items.${project.id}.title`)}</h3>
                </div>
                <div className={styles.cardLinks}>
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
                </div>
              </div>
              <p className={styles.description}>{t(`project_items.${project.id}.description`)}</p>

              <div className={styles.tags}>
                {project.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
