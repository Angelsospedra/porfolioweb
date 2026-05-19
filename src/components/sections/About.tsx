import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiAngular,
  SiTailwindcss, SiBootstrap, SiVite,
  SiGit, SiGithub, SiGitlab, SiFigma, SiSlack, SiNotion, SiJira,
} from 'react-icons/si'
import { VscSourceControl } from 'react-icons/vsc'
import { TbBrandTeams, TbBrandAzure } from 'react-icons/tb'
import { skills, skillCategories } from '../../data/skills'
import { useInView } from '../../hooks/useInView'

const skillIcons: Record<string, React.ReactElement> = {
  'React': <SiReact />,
  'Next.js': <SiNextdotjs />,
  'TypeScript': <SiTypescript />,
  'JavaScript': <SiJavascript />,
  'Angular': <SiAngular />,
  'Tailwind CSS': <SiTailwindcss />,
  'Bootstrap': <SiBootstrap />,
  'Vite': <SiVite />,
  'Git': <SiGit />,
  'GitHub': <SiGithub />,
  'GitLab': <SiGitlab />,
  'Fork': <VscSourceControl />,
  'Figma': <SiFigma />,
  'Slack': <SiSlack />,
  'Azure': <TbBrandAzure />,
  'Teams': <TbBrandTeams />,
  'Notion': <SiNotion />,
  'Jira': <SiJira />,
}
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
              <h2 className="section-title">{t('about.title')} <span className="accent">{t('about.title_accent')}</span></h2>
            </motion.div>
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
                <ul className={styles.skillList}>
                  {skills
                    .filter(s => s.category === cat)
                    .map((skill, i) => (
                      <motion.li
                        key={skill.name}
                        className={styles.skillItem}
                        variants={fadeUp}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        custom={ci * 0.1 + i * 0.05}
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
    </section>
  )
}
