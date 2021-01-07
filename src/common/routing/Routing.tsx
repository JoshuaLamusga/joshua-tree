import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { Welcome } from "../../gui/welcome/Welcome";
import { RunnerEditorView } from "../../gui/runner-editor/RunnerEditorView";
import { getStrings } from "../localization/Localization";
import { getTheme } from "office-ui-fabric-react/lib/Styling";
import { dispatchSetLocale, dispatchSetTheme } from "../settings/settings.reducers";
import { Dispatch } from "redux";
import { IRootState } from "../../store";
import { connect } from "react-redux";
import { loadFromLocalStorage } from "../storage/persistence";
import { localizedStrings } from "../localization/LocalizedStrings";
import { themes } from "../themes";
import { OpenFileHandler } from "../../gui/OpenFileHandler";
import { RunnerView } from "../../gui/runner/RunnerView";
import { MenuBar } from "../../gui/menu/MenuBar";

export const routes = {
  base: "/",

  /** Navigates to the runner (player view). */
  play: "/play",

  /** Navigates to the editor (author view). */
  edit: "/edit",
};

const mapStateToProps = (state: IRootState) => {
  return {
    locale: state.settings.locale,
    strings: getStrings(state.settings.locale),
    themeName: state.settings.theme.localizedName,
    userConsentProvided: state.persistence.userConsentProvided,
    wholeTheme: getTheme(),
  };
};

/** Returns true when the user is on the named route. */
export function isOnPage(route: keyof typeof routes) {
  return routes[route] === window.location.hash.replace(/\?.*/g, "").substring(1).toLowerCase();
}

/** Returns true when the user is playing a game or on the welcome page rather than authoring one. */
export function isNotEditMode() {
  return !isOnPage("edit");
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setLocale: dispatchSetLocale(dispatch),
    setTheme: dispatchSetTheme(dispatch),
  };
};

type RoutingOwnProps = {};
type RoutingPropsWithRouteInfo = RoutingOwnProps & RouteComponentProps;
type CombinedProps = RoutingOwnProps &
  RouteComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export class RoutingC extends React.Component<RoutingPropsWithRouteInfo> {
  /** Applies all user setting stored in local storage, if consent was provided. */
  public componentDidMount() {
    if ((this.props as CombinedProps).userConsentProvided) {
      this.applyLocalStorage();
    }
  }

  public render() {
    return (
      <>
        <OpenFileHandler />
        <MenuBar />
        <Switch>
          <Route path={routes.base} exact={true} component={Welcome} />
          <Route path={routes.edit} component={RunnerEditorView} />
          <Route path={routes.play} component={RunnerView} />
        </Switch>
      </>
    );
  }

  /** Updates redux with content loaded from local storage. */
  private applyLocalStorage = () => {
    const state = loadFromLocalStorage();
    if (state !== null) {
      if (state.localeId in localizedStrings) {
        (this.props as CombinedProps).setLocale(state.localeId);
      }

      if (themes[state.theme] !== null) {
        (this.props as CombinedProps).setTheme(themes[state.theme]);
      }
    }
  };
}

export const Routing = connect(mapStateToProps, mapDispatchToProps)(withRouter(RoutingC));
