import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import heTranslations from "./locales/he.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  he: {
    translation: heTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "he", // Default to Hebrew
    debug: false,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      useSuspense: false,
    },
  });

// Set initial direction
const setDocumentDirection = (lng) => {
  document.documentElement.dir = lng === "he" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
};

// Set initial direction on load
setDocumentDirection(i18n.language);

// Listen for language changes
i18n.on("languageChanged", setDocumentDirection);

export default i18n;
