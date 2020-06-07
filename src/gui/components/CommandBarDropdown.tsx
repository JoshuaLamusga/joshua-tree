import {
  Dropdown,
  IDropdownProps,
  getTheme,
  mergeStyles,
  IDropdownStyles,
} from "office-ui-fabric-react";
import * as React from "react";
import { IRootState } from "store";
import { connect } from "react-redux";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
    wholeTheme: getTheme(),
  };
};

export interface CommandBarDropdownProps {
  dropdown: IDropdownProps;
}

type CombinedProps = ReturnType<typeof mapStateToProps> & CommandBarDropdownProps;

/** Renders a theme-connected dropdown styled for inclusion in the main command bar. */
class CommandBarDropdownC extends React.Component<CommandBarDropdownProps> {
  public render() {
    const { styles, ...props } = (this.props as CombinedProps).dropdown;
    const stylesTyped = styles as IDropdownStyles;

    return (
      <Dropdown
        {...props}
        styles={{
          caretDownWrapper: mergeStyles(
            { alignSelf: "center", position: "relative", right: "20px", width: "0px" },
            stylesTyped?.caretDownWrapper
          ),
          dropdown: mergeStyles(
            {
              display: "flex",
              height: "100%",
            },
            stylesTyped?.dropdown
          ),
          dropdownItem: mergeStyles(
            { ...(this.props as CombinedProps).wholeTheme.fonts.large },
            stylesTyped?.dropdownItem
          ),
          dropdownItemSelected: mergeStyles(
            { ...(this.props as CombinedProps).wholeTheme.fonts.large },
            stylesTyped?.dropdownItemSelected
          ),
          root: mergeStyles({ alignSelf: "stretch" }, stylesTyped?.root),
          title: mergeStyles(
            {
              height: "100%",
              border: "0",
              borderRadius: "unset",
              display: "flex",
              alignItems: "center",
            },
            stylesTyped?.title
          ),
        }}
      />
    );
  }
}

export const CommandBarDropdown = connect(mapStateToProps)(CommandBarDropdownC);
