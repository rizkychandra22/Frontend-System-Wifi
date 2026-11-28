import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector/cjs";
// Default locale (id) loaded eagerly. en are lazy-loaded.
import id from "./locales/id";

export const SUPPORTED_LANGUAGES = ["en", "id"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  id: "Indonesia",
};

/** Lazy locale loaders — en bundles fetched on demand. */
const LOCALE_LOADERS: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("./locales/en"),
};

const loadedBundles = new Set<string>(["id"]);

async function ensureBundle(lang: string): Promise<void> {
  if (loadedBundles.has(lang)) return;
  const loader = LOCALE_LOADERS[lang];
  if (!loader) return;
  const mod = await loader();
  for (const ns in mod.default) {
    i18n.addResourceBundle(lang, ns, mod.default[ns as keyof typeof mod.default], true, true);
  }
  loadedBundles.add(lang);
}

/**
 * Switch language with guaranteed bundle loading.
 * Loads the bundle first, then changes language so all components
 * re-render with correct translations immediately.
 */
export async function changeLanguage(lang: string): Promise<void> {
  await ensureBundle(lang);
  await i18n.changeLanguage(lang);
}

/**
 * Initialize i18next with id as the default, en as universal fallback.
 * When a non-default language is detected, en is also pre-loaded so
 * that any missing key shows English instead of Indonesian.
 */
export function initI18n(storagePrefix: string = "app") {
  if (i18n.isInitialized) return i18n;

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        id,
      },
      fallbackLng: "en", // ← English is the universal fallback
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: `${storagePrefix}_language`,
        caches: ["localStorage"],
      },
      returnObjects: true,
    });

  // Pre-load English as fallback resource so missing keys never show Indonesian
  ensureBundle("en").catch(() => {});

  // After init, lazy-load the detected language if it's not the default
  const detected = i18n.language;
  if (detected !== "id" && LOCALE_LOADERS[detected]) {
    ensureBundle(detected)
      .then(() => i18n.changeLanguage(detected))
      .catch(() => {
        i18n.changeLanguage("en");
      });
  }

  return i18n;
}

export { i18n };
export { useTranslation } from "react-i18next";
export type { TFunction } from "i18next";
