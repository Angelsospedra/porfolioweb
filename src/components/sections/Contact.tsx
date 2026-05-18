import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Send } from 'lucide-react'
import { IconGithub, IconLinkedin } from '../ui/icons/BrandIcons'
import { Button } from '../ui/Button'
import { useInView } from '../../hooks/useInView'
import styles from './Contact.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const { ref, inView } = useInView()
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('sent')
  }

  return (
    <section id="contact" className={`section ${styles.contact}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-subtitle">{t('contact.subtitle')}</p>
          <h2 className="section-title">{t('contact.title')} <span className="accent">{t('contact.title_accent')}</span></h2>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className={styles.infoText}>{t('contact.info_text')}</p>
            <div className={styles.contactLinks}>
              <a href="mailto:your@email.com" className={styles.contactLink}>
                <Mail size={18} />
                <span>your@email.com</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <IconGithub size={18} />
                <span>github.com/yourhandle</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <IconLinkedin size={18} />
                <span>linkedin.com/in/yourhandle</span>
              </a>
            </div>
          </motion.div>

          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>{t('contact.form.name')}</label>
                <input
                  id="name" name="name" type="text" required
                  className={styles.input} placeholder={t('contact.form.name_placeholder')}
                  value={form.name} onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>{t('contact.form.email')}</label>
                <input
                  id="email" name="email" type="email" required
                  className={styles.input} placeholder={t('contact.form.email_placeholder')}
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>{t('contact.form.message')}</label>
              <textarea
                id="message" name="message" required rows={5}
                className={styles.textarea} placeholder={t('contact.form.message_placeholder')}
                value={form.message} onChange={handleChange}
              />
            </div>

            {status === 'sent' ? (
              <p className={styles.success}>{t('contact.form.success')}</p>
            ) : (
              <Button type="submit" size="lg" disabled={status === 'sending'}>
                <Send size={16} />
                {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
              </Button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
