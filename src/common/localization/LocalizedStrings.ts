import { ILocalizedStringSets } from "./Localization";

// tslint:disable:max-line-length It's actually more legible to keep strings on one line here.

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: "Joshua Tree",
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`,
    LanguageCodeName: "English (United States)",
    MenuFile: "File",
    MenuFileNew: "New",
    MenuFileOpen: "Open",
    MenuFileSave: "Save",
    ThemeContrastDark: "🌑 Contrast Dark",
    ThemeContrastLight: "☀️ Contrast Light",
    ThemeDefaultDark: "🌑 Default Dark",
    ThemeDefaultLight: "☀️ Default Light",
    ThemeDeepSea: "🌑 Deep Sea",
    ThemeEarthAndSky: "☀️ Earth and Sky",
    ThemeLucky: "☀️ Lucky",
    ThemeMidnightEarth: "🌑 Midnight Earth",
    ThemeDropdownText: (themeName: string) => `${themeName} theme`,
    TipLanguage: "Language",
    TipNavigateCommandBar: "Use left and right arrow keys to navigate between commands.",
    TipTheme: "Theme",
  },
};
