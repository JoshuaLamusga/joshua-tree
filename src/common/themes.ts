import { getStrings } from "./localization/Localization";
import { loadTheme, ITheme } from "office-ui-fabric-react/lib/Styling";

export interface ISupportedTheme {
  localizedName: string;
  theme: ITheme;
}

export interface ISupportedThemes {
  light: ISupportedTheme;
  dark: ISupportedTheme;
}

const strings = getStrings();

/** Colors with associated themes. */
export const themes: ISupportedThemes = {
  dark: {
    localizedName: strings.ThemeDark,
    theme: loadTheme({
      palette: {
        black: "#ffffff",
        neutralDark: "#ececec",
        neutralLight: "#515151",
        neutralLighter: "#222222",
        neutralLighterAlt: "#090909",
        neutralPrimary: "#dcdcdc",
        neutralPrimaryAlt: "#bbbbbb",
        neutralQuaternary: "#d0d0d0",
        neutralQuaternaryAlt: "#dadada",
        neutralSecondary: "#9f9f9f",
        neutralTertiary: "#666666",
        neutralTertiaryAlt: "#ffffff",
        themeDark: "#ebebeb",
        themeDarkAlt: "#dbdbdb",
        themeDarker: "#ffffff",
        themeLight: "#3f3f3f",
        themeLighter: "#212121",
        themeLighterAlt: "#000000",
        themePrimary: "#bfbfbf",
        themeSecondary: "#868686",
        themeTertiary: "#5a5a5a",
        white: "#000000",
      },
    }),
  },
  light: {
    localizedName: strings.ThemeLight,
    theme: loadTheme({
      palette: {
        black: "#000000",
        neutralDark: "#131313",
        neutralLight: "#aeaeae",
        neutralLighter: "#dddddd",
        neutralLighterAlt: "#f6f6f6",
        neutralPrimary: "#232323",
        neutralPrimaryAlt: "#444444",
        neutralQuaternary: "#2f2f2f",
        neutralQuaternaryAlt: "#252525",
        neutralSecondary: "#606060",
        neutralTertiary: "#999999",
        neutralTertiaryAlt: "#000000",
        themeDark: "#141414",
        themeDarkAlt: "#242424",
        themeDarker: "#000000",
        themeLight: "#c0c0c0",
        themeLighter: "#dedede",
        themeLighterAlt: "#ffffff",
        themePrimary: "#404040",
        themeSecondary: "#797979",
        themeTertiary: "#a5a5a5",
        white: "#ffffff",
      },
    }),
  },
};