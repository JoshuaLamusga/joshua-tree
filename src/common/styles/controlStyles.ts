import {
  IButtonStyles,
  IStyle,
  mergeStyles,
  ITheme,
  ICommandBarStyles,
  IIconStyles,
  IDropdownStyles,
} from "office-ui-fabric-react";

/**
 * Returns a style for a command bar that tries to maximize the size of the items within it, for a
 * simplified appearance that is more mobile-friendly than the default style. Items within the
 * command bar should be styled to fill the command bar vertically, and take enough space to be
 * easy to interact with.
 */
export const commandBarStyle = (theme: ITheme): ICommandBarStyles => {
  return {
    root: {
      alignItems: "center",
      borderWidth: "1px",
      borderBottomStyle: "solid",
      borderColor: theme.semanticColors.bodyText,
      padding: "0px",
    },
    primarySet: {
      alignSelf: "stretch",
    },
    secondarySet: {
      alignSelf: "stretch",
    },
  };
};

/**
 * Returns a style for a dropdown in the command bar. If there are items to the right, renders a
 * thin border between.
 */
export const commandBarDropdownButtonStyle = (): IButtonStyles => {
  return { root: { alignSelf: "stretch" } };
};

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

/** The expected minimum margin around components on the page. */
export const controlMargin: IStyle = {
  margin: "4px",
};

/** Display none. */
export const hiddenAndInaccessible: IStyle = {
  display: "none",
};

/** Separates an icon from the text  */
export const iconSpaceBeforeTextStyle: IIconStyles = {
  root: {
    marginRight: "8px",
  },
};
