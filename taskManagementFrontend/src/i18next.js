import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ar from "./translations/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback if language is missing
  interpolation: { escapeValue: false }, // React escapes by default
});

export default i18n;
