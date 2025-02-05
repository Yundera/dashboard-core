import polyglotI18nProvider from "ra-i18n-polyglot";
import customEnglishMessages from "../i18n/en";
import customFrenchMessages from "../i18n/fr";
import type {PanelInterface} from "../PanelInterface";
import type {TranslationMessages} from "react-admin";

type I18nStore = Record<string, TranslationMessages>;

export const i18nProvider = (
  panels: PanelInterface[],
  custom: Record<string, TranslationMessages> = {}
) => {
  let i18n: I18nStore = {};

  return polyglotI18nProvider(locale=> {
    if (Object.keys(i18n).length === 0) {
      // Initialize with default translations
      i18n = {
        fr: { ...customFrenchMessages, resources: {} },
        en: { ...customEnglishMessages, resources: {} }
      };

      // Add custom translations
      for (const customLocale of Object.keys(custom)) {
        i18n[customLocale] = {
          ...custom[customLocale],
          resources: {}
        };
      }

      // Add panel translations
      for (const panel of panels) {
        if (panel.i18n && panel.name) {
          for (const panelLocale of Object.keys(panel.i18n)) {
            if (!i18n[panelLocale]) {
              i18n[panelLocale] = { resources: {} } as unknown as TranslationMessages;
            }
            (i18n[panelLocale] as any).resources[panel.name] = panel.i18n[panelLocale];
          }
        }
      }
    }

    return i18n[locale] || i18n['en']; // Fallback to English if locale not found
  }, 'en', 'fr');
};