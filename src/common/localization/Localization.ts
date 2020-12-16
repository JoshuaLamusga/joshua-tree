import { localizedStrings } from "./LocalizedStrings";

/**
 * Gets the nearest supported locale from the browser using navigator.languages or
 * navigator.language. This is accurate for Firefox and Chrome. IE and Edge return the OS language
 * instead and only return the browser language from an Accept-Languages header. This is considered
 * good enough though. Defaults to en-US if the preferred locale isn't listed.
 */
export const getSupportedLocale = (): keyof ILocalizedStringSets => {
  let defaultLocale = "en-us";

  // This is an experimental feature at time of writing, so it may be undefined.
  if (navigator.languages !== undefined) {
    for (const lang of navigator.languages) {
      const langParts = lang.toLowerCase().split("-");
      const language = langParts[0];
      const region = langParts.length > 1 ? langParts[1] : "";

      // If a language but not the dialect for a region is available, use it instead.
      if (`${language}-${region}` in supportedLocales) {
        defaultLocale = `${language}-${region}`;
        break;
      } else if (`${language}` in supportedLocales) {
        defaultLocale = `${language}`;
        break;
      }
    }
  } else {
    const language = navigator.language.toLowerCase();

    if (language in supportedLocales) {
      defaultLocale = language;
    }
  }

  return supportedLocales[defaultLocale as keyof ISupportedLocales];
};

/** Returns the strings for the given locale, or the assumed locale if not provided. */
export const getStrings = (locale?: keyof ISupportedLocales): ILocalizedStrings => {
  return localizedStrings[supportedLocales[locale || getSupportedLocale()] as keyof typeof localizedStrings];
};

/** All locales to be accepted as valid. */
export interface ISupportedLocales {
  "en": keyof ILocalizedStringSets;
  "en-us": keyof ILocalizedStringSets;
}

/** A list of valid locales as keys, and the locales they default to as values. */
export const supportedLocales: ISupportedLocales = {
  "en": "en-us",
  "en-us": "en-us",
};

/** All locales with direct support. */
export interface ILocalizedStringSets {
  "en-us": ILocalizedStrings;
}

/** All strings to be localized per locale. */
export interface ILocalizedStrings {
  ApplicationName: string;
  ApplicationNameAndVersion: (appName: string, appVersion: string) => string;
  LanguageCodeName: string;
  MenuFile: string;
  MenuFileNew: string;
  MenuFileOpen: string;
  MenuFileSave: string;
  ThemeContrastDark: string;
  ThemeContrastLight: string;
  ThemeDefaultDark: string;
  ThemeDefaultLight: string;
  ThemeDeepSea: string;
  ThemeEarthAndSky: string;
  ThemeLucky: string;
  ThemeMidnightEarth: string;
  ThemeDropdownText: (themeName: string) => string;
  TipLanguage: string;
  TipNavigateCommandBar: string;
  TipTheme: string;
}
