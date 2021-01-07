import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { CommandBar } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { isOnPage } from "../../common/routing/Routing";
import { IRootState } from "../../store";
import { getStrings } from "../../common/localization/Localization";
import { dispatchSetLocale, dispatchSetTheme } from "../../common/settings/settings.reducers";
import { getEditorCommandItems } from "../editor/EditorMenuItems";
import { commandBarStyle } from "../../common/styles/controlStyles";
import { getRunnerCommandItems } from "../runner/RunnerMenuItems";
import { getCommonCommandItems } from "./CommonMenuItems";

const mapStateToProps = (state: IRootState) => {
  return {
    locale: state.settings.locale,
    reduxState: state,
    strings: getStrings(state.settings.locale),
    themeName: state.settings.theme.localizedName,
    userConsentProvided: state.persistence.userConsentProvided,
    wholeTheme: getTheme(),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLocale: dispatchSetLocale(dispatch),
    setTheme: dispatchSetTheme(dispatch),
  };
};

type MenuBarOwnProps = {};
type MenuBarRoutingProps = MenuBarOwnProps & RouteComponentProps;
type CombinedProps = MenuBarRoutingProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class MenuBarC extends React.Component<MenuBarRoutingProps> {
  public render() {
    let items: ICommandBarItemProps[];
    const farItems: ICommandBarItemProps[] = getCommonCommandItems(this.props as CombinedProps);

    if (isOnPage("edit")) {
      items = getEditorCommandItems(this.props as CombinedProps);
    } else if (isOnPage("play")) {
      items = getRunnerCommandItems(this.props as CombinedProps);
    } else {
      items = [];
    }

    return (
      <CommandBar
        ariaLabel={(this.props as CombinedProps).strings.TipNavigateCommandBar}
        items={items}
        farItems={farItems}
        styles={commandBarStyle}
      />
    );
  }
}

export const MenuBar = connect(mapStateToProps, mapDispatchToProps)(withRouter(MenuBarC));
