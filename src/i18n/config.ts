import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import va from './locales/va.json'
import ja from './locales/ja.json'
import pt from './locales/pt.json'
import it from './locales/it.json'
import zh from './locales/zh.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    va: { translation: va },
    ja: { translation: ja },
    pt: { translation: pt },
    it: { translation: it },
    zh: { translation: zh },
  },
  lng: localStorage.getItem('lang') ?? 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
