import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Send } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { SiArtstation } from 'react-icons/si'
import { IconGithub, IconLinkedin } from '../ui/icons/BrandIcons'
import { Button } from '../ui/Button'
import { useInView } from '../../hooks/useInView'
import styles from './Contact.module.css'
import heroStyles from './Hero.module.css'

const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

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
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        { from_name: form.name, from_email: form.email, message: form.message },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={`section ${styles.contact}`} ref={ref as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className={styles.grid}>
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <p className="section-subtitle">{t('contact.subtitle')}</p>
              <h2 className="section-title">{t('contact.title')} <span className="accent">{t('contact.title_accent')}</span></h2>
            </motion.div>
            <p className={styles.infoText}>{t('contact.info_text')}</p>
            <div className={styles.contactLinks}>
              <a href="mailto:angelsospedramartinez@gmail.com" className={styles.contactLink}>
                <Mail size={18} />
                <span>angelsospedramartinez@gmail.com</span>
              </a>
              <a href="https://github.com/Angelsospedra" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <IconGithub size={18} />
                <span>github.com/Angelsospedra</span>
              </a>
              <a href="https://www.linkedin.com/in/angel-sospedra/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <IconLinkedin size={18} />
                <span>linkedin.com/in/angel-sospedra</span>
              </a>
              <a href="https://www.artstation.com/angelsospedra" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                <SiArtstation size={18} />
                <span>artstation.com/angelsospedra</span>
              </a>
            </div>
            <Button
              as="a"
              href={`${import.meta.env.BASE_URL}CV.pdf`}
              download
              variant="ghost"
              size="lg"
              className={heroStyles.cvBtn}
              style={{ alignSelf: 'flex-start' }}
            >
              ↓ {t('hero.cta_cv')}
            </Button>
          </motion.div>

          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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

            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>{t('contact.form.message')}</label>
              <textarea
                id="message" name="message" required rows={5}
                className={styles.textarea} placeholder={t('contact.form.message_placeholder')}
                value={form.message} onChange={handleChange}
              />
            </div>

            {status === 'sent' && <p className={styles.success}>{t('contact.form.success')}</p>}
            {status === 'error' && <p className={styles.error}>{t('contact.form.error')}</p>}
            {status !== 'sent' && (
              <div className={styles.submitRow}>
                <Button type="submit" size="lg" disabled={status === 'sending'}>
                  <Send size={16} />
                  {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
                </Button>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
