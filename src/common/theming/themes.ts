import { IPartialTheme } from "office-ui-fabric-react";
import { getStrings } from "../localization/Localization";

export interface ISupportedTheme {
  localizedName: string;
  theme: IPartialTheme;
}

export interface ISupportedThemes {
  default: ISupportedTheme;
  dark: ISupportedTheme;
}

const strings = getStrings();

/** Colors with associated themes. */
export const themes: ISupportedThemes = {
  dark: {
    localizedName: strings.ThemeDark,
    theme: {
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
    },
  },
  default: {
    localizedName: strings.ThemeLight,
    theme: {},
  },
};
