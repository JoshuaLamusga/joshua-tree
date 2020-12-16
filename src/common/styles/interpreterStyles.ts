import { ITextStyle } from "../redux/typedefs";
import { ISupportedTheme, ThemeTypes } from "../themes";
import { fallbackFontStack } from "./controlStyles";

/** Declaring the element type allows the interpreter to select the right fallback styles. */
export enum fallbackElementType {
  input,
  option,
  optionHighlight,
  output,
}

/**
 * The inherent styles used for different elements, if no other style is applied.
 * Note that the redundant casting below is necessary as of TS 4.0.3 due to type resolution problems.
 */
const fallbackStyles = (theme: ISupportedTheme) => {
  return {
    [fallbackElementType.input]: {
      color: theme.theme.semanticColors.errorText,
      fontFamily: fallbackFontStack,
      fontSize: "1.2 rem",
      fontStyle: "normal" as "normal",
      fontWeight: "normal" as "normal",
      textDecoration: "inherit" as "inherit",
    },
    [fallbackElementType.option]: {
      color: theme.theme.palette.blue,
      fontFamily: fallbackFontStack,
      fontSize: "1.2 rem",
      fontStyle: "normal" as "normal",
      fontWeight: "normal" as "normal",
      textDecoration: "underline" as "underline",
    },
    [fallbackElementType.optionHighlight]: {
      color: theme.theme.palette.blueDark,
      fontFamily: fallbackFontStack,
      fontSize: "1.2 rem",
      fontStyle: "normal" as "normal",
      fontWeight: "normal" as "normal",
      textDecoration: "underline" as "underline",
    },
    [fallbackElementType.output]: {
      color: theme.theme.semanticColors.bodyText,
      fontFamily: fallbackFontStack,
      fontSize: "1.2 rem",
      fontStyle: "normal" as "normal",
      fontWeight: "normal" as "normal",
      textDecoration: "inherit" as "inherit",
    },
  };
};

/**
 * Applies text styles to determine font family, size, bold/italic/underline, and color. Players can set their own
 * style overrides (playerStyle). The author can set styles within the game that deviate from the normal styling
 * (storyStyle), and set a global default style for the story (authorStyle). When editing a story, playerStyle should
 * be left empty. PlayerStyle overrides storyStyle, which overrides authorStyle. Overrides work per attribute, and
 * fall down to the next style if not met, or a natural default if none are met.
 *
 * Light colors are used in lightMode and dark colors in darkMode, as defined by the theming.
 *
 * @param playerStyle Styles that a player has set to override all styles in stories they read, if set.
 * @param storyStyle Specific one-off styling within the story.
 * @param authorStyle Styles that an author has set as the default text styling.
 */
export const getTextStyle = (
  theme: ISupportedTheme,
  playerStyle: ITextStyle,
  storyStyle: ITextStyle,
  authorStyle: ITextStyle,
  fallback: fallbackElementType
): React.CSSProperties => {
  const fallbackStyle = fallbackStyles(theme)[fallback];

  const color =
    theme.themeType === ThemeTypes.Light
      ? playerStyle.colorLight || storyStyle.colorLight || authorStyle.colorLight || fallbackStyle.color
      : playerStyle.colorDark || storyStyle.colorDark || authorStyle.colorDark || fallbackStyle.color;

  const fontFamily = playerStyle.font || storyStyle.font || authorStyle.font || fallbackStyle.fontFamily;
  const fontSize = playerStyle.fontSize || storyStyle.fontSize || authorStyle.fontSize || fallbackStyle.fontSize;

  let fontStyle: "italic" | "normal" = "normal";
  let fontWeight: "bold" | "normal" = "normal";
  let textDecoration: "underline" | "inherit" = "inherit";

  if (playerStyle.fontStyle) {
    fontStyle = playerStyle.fontStyle.includes("i") ? "italic" : fallbackStyle.fontStyle;
  } else if (storyStyle.fontStyle) {
    fontStyle = storyStyle.fontStyle.includes("i") ? "italic" : fallbackStyle.fontStyle;
  } else if (authorStyle.fontStyle) {
    fontStyle = authorStyle.fontStyle.includes("i") ? "italic" : fallbackStyle.fontStyle;
  }

  if (playerStyle.fontStyle) {
    fontWeight = playerStyle.fontStyle.includes("b") ? "bold" : fallbackStyle.fontWeight;
  } else if (storyStyle.fontStyle) {
    fontWeight = storyStyle.fontStyle.includes("b") ? "bold" : fallbackStyle.fontWeight;
  } else if (authorStyle.fontStyle) {
    fontWeight = authorStyle.fontStyle.includes("b") ? "bold" : fallbackStyle.fontWeight;
  }

  if (playerStyle.fontStyle) {
    textDecoration = playerStyle.fontStyle.includes("u") ? "underline" : fallbackStyle.textDecoration;
  } else if (storyStyle.fontStyle) {
    textDecoration = storyStyle.fontStyle.includes("u") ? "underline" : fallbackStyle.textDecoration;
  } else if (authorStyle.fontStyle) {
    textDecoration = authorStyle.fontStyle.includes("u") ? "underline" : fallbackStyle.textDecoration;
  }

  return {
    color,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    textDecoration,
    whiteSpace: "pre-wrap", // respects newlines and multiple whitespace.
  };
};
