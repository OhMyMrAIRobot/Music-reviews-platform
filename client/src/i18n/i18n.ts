import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import ru from '../locales/ru/translation.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const;

const setHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.split('-')[0];
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => {
    setHtmlLang(i18n.resolvedLanguage ?? i18n.language);
  });

i18n.on('languageChanged', setHtmlLang);

export default i18n;
