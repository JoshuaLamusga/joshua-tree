import { ILocalizedStringSets } from "./Localization";

// tslint:disable:max-line-length It's actually more legible to keep strings on one line here.

/** All strings localized in all locales. */
export const localizedStrings: ILocalizedStringSets = {
  "en-us": {
    ApplicationName: "Joshua Tree",
    ApplicationNameAndVersion: (appName: string, appVersion: string) => `${appName} version ${appVersion}`,
    EditorPlay: "Play",
    LanguageCodeName: "English (United States)",
    MenuFile: "File",
    MenuFileNew: "New",
    MenuFileOpen: "Open",
    MenuFileSave: "Save",
    MenuFileSwitch: "Switch between play and edit",
    RunnerRestart: "Restart",
    ThemeContrastDark: "🌑 Contrast Dark",
    ThemeContrastLight: "☀️ Contrast Light",
    ThemeDefault: "☀️ Default",
    ThemeDeepSea: "🌑 Deep Sea",
    ThemeDim: "🌑 Dim",
    ThemeEarthAndSky: "☀️ Earth and Sky",
    ThemeMidnight: "🌑 Midnight",
    ThemeMuted: "☀️ Muted",
    ThemeSlate: "🌑 Slate",
    ThemeDropdownText: (themeName: string) => `${themeName} theme`,
    TipLanguage: "Language",
    TipNavigateCommandBar: "Use left and right arrow keys to navigate between commands.",
    TipTheme: "Theme",
    WelcomeButtonOpenPlay: "Open & Play",
    WelcomeButtonOpenEdit: "Open & Edit",
    WelcomeButtonNew: "New",
  },
};
