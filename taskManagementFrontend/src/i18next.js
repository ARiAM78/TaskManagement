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

<<<<<<< HEAD
export default i18n;
=======
export default i18n;
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
