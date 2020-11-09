import * as React from "react";
import { IRootState } from "store";
import { connect } from "react-redux";
import { commandBarDropdownStyle } from "../../common/styles/controlStyles";
import {
  IDropdownProps,
  IDropdownStyles,
} from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { Dropdown } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown";

const mapStateToProps = (state: IRootState) => {
  return {
    theme: state.settings.theme,
  };
};

/** Main props associated with the MenuBarDropdown. */
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
        styles={commandBarDropdownStyle((this.props as CombinedProps).theme.theme, stylesTyped)}
      />
    );
  }
}

export const CommandBarDropdown = connect(mapStateToProps)(CommandBarDropdownC);
