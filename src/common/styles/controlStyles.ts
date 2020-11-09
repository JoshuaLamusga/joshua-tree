import { CSSProperties } from "react";
import { IButtonStyles } from "office-ui-fabric-react/lib/components/Button/Button.types";
import { ITheme, mergeStyles, IStyle } from "office-ui-fabric-react/lib/Styling";
import { IDropdownStyles } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { ICommandBarStyles } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { IIconStyles } from "office-ui-fabric-react/lib/components/Icon/Icon.types";

/**
 * Returns a style for a dropdown in the command bar. If there are items to the right, renders a
 * thin border between.
 */
export const commandBarDropdownButtonStyle = (): IButtonStyles => {
  return { root: { alignSelf: "stretch" } };
};

/**
 * Returns a style for a command bar dropdown that renders a border to the right of the item.
 */
export const commandBarDropdownSeparatorStyle = (theme: ITheme): Partial<IDropdownStyles> => {
  return {
    root: {
      borderColor: theme.semanticColors.bodyText,
      borderRightStyle: "solid",
      borderWidth: "1px",
    },
  };
};

/** Returns a style for a dropdown in the command bar. */
export const commandBarDropdownStyle = (theme: ITheme, propStyles: IDropdownStyles): Partial<IDropdownStyles> => {
  return {
    caretDownWrapper: mergeStyles(
      { alignSelf: "center", position: "relative", right: "20px", width: "0px" },
      propStyles?.caretDownWrapper
    ),
    dropdown: mergeStyles(
      {
        display: "flex",
        height: "100%",
      },
      propStyles?.dropdown
    ),
    dropdownItem: mergeStyles(
      { ...theme.fonts.large },
      propStyles?.dropdownItem
    ),
    dropdownItemSelected: mergeStyles(
      { ...theme.fonts.large },
      propStyles?.dropdownItemSelected
    ),
    root: mergeStyles({ alignSelf: "stretch" }, propStyles?.root),
    title: mergeStyles(
      {
        height: "100%",
        border: "0",
        borderRadius: "unset",
        display: "flex",
        alignItems: "center",
      },
      propStyles?.title
    ),
  }
}

/**
 * Returns a style for a command bar item definition that increase button space. If there are
 * items to the right, renders a thin border between.
 */
export const commandBarItemStyle = (theme: ITheme, itemsOnRight?: boolean): string => {
  if (itemsOnRight) {
    return mergeStyles(theme.fonts.large, {
      paddingLeft: "12px",
      paddingRight: "12px",
      borderColor: theme.semanticColors.bodyText,
      borderRightStyle: "solid",
      borderWidth: "1px",
    });
  }

  return mergeStyles(theme.fonts.large, {
    paddingLeft: "12px",
    paddingRight: "12px",
  });
};

/**
 * Returns a style for a command bar that tries to maximize the size of the items within it, for a
 * simplified appearance that is more mobile-friendly than the default style. Items within the
 * command bar should be styled to fill the command bar vertically, and take enough space to be
 * easy to interact with.
 */
export const commandBarStyle: ICommandBarStyles = {
  root: {
    alignItems: "center",
    height: "4vh",
    padding: "0px",
  },
  primarySet: {
    alignSelf: "stretch",
  },
  secondarySet: {
    alignSelf: "stretch",
  },
};

/** Returns a style for the editor text area component. */
export const editorTextAreaStyle = (theme: ITheme): object => {
  return {
    color: theme.semanticColors.bodyText,
    backgroundColor: theme.semanticColors.bodyStandoutBackground,
    borderColor: theme.semanticColors.bodyText,
    borderStyle: "solid",
    borderWidth: "1px",
    height: "90vh",
    padding: 0,
    resize: "none",
    width: "100%",
  };
}

/** Fonts to use in case other fonts are not available. */
export const fallbackFontStack = "Calibri; Times New Roman; Courier New; sans-serif";

/** Display none. */
export const hiddenAndInaccessible = mergeStyles({
  display: "none",
});

/** Separates an icon from text that follows it.  */
export const iconSpaceBeforeTextStyle: IIconStyles = {
  root: {
    marginRight: "8px",
  },
};

/** Sets up the div containing the editor textarea. */
export const mainViewEditorStyle = mergeStyles({ height: "90vh", margin: "0 4px 0 0", width: "50vw" });

/** Styles the runner to give it a border and make overflowing generated content scroll. */
export const mainViewRunnerStyle = (theme: ITheme): IStyle => {
  return {
    borderColor: theme.semanticColors.bodyText,
    borderStyle: "solid",
    borderWidth: "1px",
    margin: "0 0 0 4px",
    overflowY: "scroll",
    width: "50vw",
  };
};

/** Sets up the div containing the editor and runner so they stretch horizontally to full size. */
export const mainViewWrapperStyle = mergeStyles({ display: "flex", alignItems: "stretch" });

/** Styles the input textbox of the runner. */
export const runnerInputTextboxStyle = (theme: ITheme): CSSProperties => {
  return {
    backgroundColor: theme.semanticColors.bodyBackground,
    color: theme.semanticColors.bodyText,
    alignSelf: "stretch",
    flexShrink: 1,
    fontSize: "16px",
    height: "32px"
  }
};

/** Styles the innermost div that contains all generated content in the runner. */
export const runnerOutputWrapperStyle = mergeStyles({ flexGrow: 1, margin: "4px" });

/** Styles the div containing all controls associated to the runner so they display properly. */
export const runnerWrapperStyle = mergeStyles({ display: "flex", flexDirection: "column", height: "90vh" });

/** The default style of echoed player input reminder text, which changes at runtime. */
export const runnerDefaultInputStyle = (theme: ITheme) => {
  return {
    color: theme.semanticColors.warningText,
    fontFamily: fallbackFontStack,
    fontSize: "16px",
    fontWeight: 400
  };
};

/** The default style of options when not highlighted in the runner, which changes at runtime. */
export const runnerDefaultOptionsStyle = (theme: ITheme) => {
  return {
    color: theme.semanticColors.primaryButtonText,
    fontFamily: fallbackFontStack,
    fontSize: "16px",
    fontWeight: 400
  };
};

/** The default style of options when highlighted in the runner, which changes at runtime. */
export const runnerDefaultOptionsHighlightStyle = (theme: ITheme) => {
  return {
    color: theme.semanticColors.primaryButtonTextHovered
  };
};

/** The default style of output in the runner, which changes at runtime. */
export const runnerDefaultOutputStyle = (theme: ITheme) => {
  return {
    color: theme.semanticColors.bodyText,
    fontFamily: fallbackFontStack,
    fontSize: theme.fonts.large.fontSize,
    fontWeight: 400
  };
};

/** The default style of the runner background, which changes at runtime. */
export const runnerDefaultWrapperStyle = (theme: ITheme) => {
  return {
    backgroundColor: theme.semanticColors.bodyStandoutBackground
  };
};