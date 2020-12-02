/** Determines the appearance of text. */
export interface ITextStyle {
  /** Text color as seen in dark theme. Defaults to dark theme text color. */
  colorDark?: string;

  /** Text color as seen in light theme. Defaults to light theme text color. */
  colorLight?: string;

  /** Text size. Defaults to 1 rem. */
  fontSize?: string;

  /** Font styles (i = italic, b = bold, u = underline). Defaults to being unstyled. */
  fontStyle?: "i" | "b" | "u" | "ib" | "iu" | "bu" | "ibu";

  /** Font family. Defaults to the app font fallback list. */
  font?: string;
}

/** Determines the appearance of a border. */
export interface IBorderStyle {
  /** Defaults to dark theme text color. */
  colorDark?: string;

  /** Defaults to light theme text color. */
  colorLight?: string;

  /** Defaults to solid. */
  style?: "dotted" | "dashed" | "double";

  /** Defaults to 0.07 rem. */
  thickness?: number;

  /** Defaults to being sharp (no border radius). */
  cornerRounding?: "semiround" | "round";
}

/** Determines the appearance of the log separator. */
export interface IRunnerLogSeparatorStyle {
  style: (IRunnerLogSeparatorBarStyle & { type: "bar" }) | (IRunnerLogSeparatorImageStyle & { type: "image" });
}

/** Determines the appearance of a line separating old and current page contents. */
export interface IRunnerLogSeparatorBarStyle extends IBorderStyle {}

/** Determines the appearance of an image separating old and current page elements. */
export interface IRunnerLogSeparatorImageStyle {
  /**
   * Determines how images respond to story width, scaling only horizontally or both horizontally and vertically until
   * the image touches both sides of the story column width. Defaults to no scaling.
   */
  scaling?: "scaleWide" | "scaleBoth";

  /** Image path. It can be a relative local file url, or an absolute web url without the protocol. */
  imageUrl: string;
}

/** Determines the overall appearance of the player. */
export interface IRunnerStyle {
  /** The background can be plain or an image. */
  background: (IRunnerPlainStyle & { type: "plain" }) | (IRunnerImageStyle & { type: "image" });
}

/** Determines the appearance of a plain background for the player. */
export interface IRunnerPlainStyle {
  /** Background color of the player as seen in dark mode. Defaults to dark theme background color. */
  colorDark?: string;

  /** Background color of the player as seen in light mode. Defaults to light theme background color. */
  colorLight?: string;
}

/** Determines the appearance of an image background for the player. */
export interface IRunnerImageStyle {
  /**
   * Tiling display style. The image can stretch horizontally and tile vertically, or tile in both directions. Defaults
   * to stretching to fill visible space (without moving when the user scrolls).
   */
  tileMode?: "tileVertical" | "tileBoth";

  /** Image path. It can be a relative local file url, or an absolute web url without the protocol. */
  imageUrl: string;

  /** A rectangle below the text and above the background image. By default, no underlay is shown. */
  textUnderlay?: IRunnerTextUnderlayStyle;
}

/** Determines the appearance of a rectangle between the background image and page contents. */
export interface IRunnerTextUnderlayStyle {
  /** Styles the border of a rectangle above the background image and below the text. Defaults to no border. */
  border?: IBorderStyle;

  /** Color of the underlay rectangle as seen in dark theme. Defaults to dark theme text color. */
  colorDark?: string;

  /** Color of the underlay rectangle as seen in light theme. Defaults to light theme text color. */
  colorLight?: string;

  /** Opacity of the underlay rectangle as a value from 0 (translucent) to 1 (opaque). Defaults to 1. */
  opacity?: number;
}

/** Options affecting the behavior of the player. */
export interface IRunnerOptions {
  /** Number of output and input blocks to preserve. Default unrestricted. */
  logLimit?: number;

  /** Whether to show old output and input blocks in the player. Default true. */
  showLog?: false;
}

// prebuilt style profiles for simplicity so people don't have to fiddle with everything (and ability to define new ones)
// spelling/grammar
// autosave and manual save control
// file format needs a section for plugin data and a callback to handle it. Use a dict with plugin name as key.
// hyperlink styling
// feature to register plugins once they have loaded, using a unique key. Feature to require players to have named plugins (with download hyperlink and notes).
// track version
// keyboard shortcuts and overrides (nothing affecting the player)
