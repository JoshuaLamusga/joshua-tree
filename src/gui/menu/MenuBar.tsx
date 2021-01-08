import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { ICommandBarItemProps } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar.types";
import { CommandBar } from "office-ui-fabric-react/lib/components/CommandBar/CommandBar";
import { isOnPage } from "../../common/routing/Routing";
import { IRootState } from "../../store";
import { getStrings } from "../../common/localization/Localization";
import { dispatchSetLocale, dispatchSetTheme } from "../../common/settings/settings.reducers";
import { getEditorCommandItems } from "../editor/EditorMenuItems";
import { commandBarStyle } from "../../common/styles/controlStyles";
import { getRunnerCommandItems } from "../runner/RunnerMenuItems";
import { getCommonCommandItems } from "./CommonMenuItems";
import { RouteComponentProps, withRouter } from "react-router-dom";

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
type MenuBarWithRouterProps = MenuBarOwnProps & RouteComponentProps;
type CombinedProps = MenuBarWithRouterProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class MenuBarC extends React.Component<MenuBarWithRouterProps> {
  public render() {
    const combinedProps = this.props as CombinedProps;

    let items: ICommandBarItemProps[];
    let farItems = getCommonCommandItems(combinedProps);

    if (isOnPage("edit")) {
      const editorItems = getEditorCommandItems(combinedProps);
      items = editorItems.items;
      farItems = [...editorItems.farItems, ...farItems];
    } else if (isOnPage("play")) {
      const runnerItems = getRunnerCommandItems(combinedProps);
      items = runnerItems.items;
      farItems = [...runnerItems.farItems, ...farItems];
    } else {
      items = [];
    }

    return (
      <CommandBar
        ariaLabel={combinedProps.strings.TipNavigateCommandBar}
        items={items}
        farItems={farItems}
        styles={commandBarStyle}
      />
    );
  }
}

export const MenuBar = connect(mapStateToProps, mapDispatchToProps)(withRouter(MenuBarC));
