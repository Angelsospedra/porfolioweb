import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { sendToGemini, type Message } from '../../services/gemini'
import styles from './ChatBot.module.css'

export function ChatBot() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && !hasStarted) {
      setHasStarted(true)
    }
  }, [isOpen, hasStarted])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: 'user', text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setIsLoading(true)

    try {
      const reply = await sendToGemini(next)
      setMessages(prev => [...prev, { role: 'model', text: reply }])
    } catch (err) {
      console.error('[ChatBot]', err)
      setMessages(prev => [...prev, { role: 'model', text: t('chatbot.error') }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return createPortal(
    <div className={styles.root}>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            role="dialog"
            aria-label={t('chatbot.title')}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.botAvatar}>
                  <Bot size={16} />
                </div>
                <div>
                  <p className={styles.headerTitle}>{t('chatbot.title')}</p>
                  <p className={styles.headerSub}>{t('chatbot.subtitle')}</p>
                </div>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label={t('common.close')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              {!hasStarted || messages.length === 0 ? (
                <div className={styles.welcomeWrapper}>
                  <div className={styles.welcomeAvatar}>
                    <Bot size={22} />
                  </div>
                  <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                    {t('chatbot.welcome')}
                  </div>
                </div>
              ) : null}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`${styles.messageRow} ${msg.role === 'user' ? styles.rowUser : styles.rowBot}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {msg.role === 'model' && (
                    <div className={styles.bubbleAvatar}>
                      <Bot size={12} />
                    </div>
                  )}
                  <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className={`${styles.messageRow} ${styles.rowBot}`}>
                  <div className={styles.bubbleAvatar}>
                    <Bot size={12} />
                  </div>
                  <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
              <textarea
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatbot.placeholder')}
                rows={1}
                disabled={isLoading}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label={t('chatbot.send')}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label={t('chatbot.toggle')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>,
    document.body
  )
}
