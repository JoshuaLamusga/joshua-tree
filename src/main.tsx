import { createBrowserHistory } from "history";
import { initializeIcons } from "office-ui-fabric-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router, Switch } from "react-router";
import { listenForShortcuts } from "./common/commands/shortcutManager";
import { store } from "./store";
import { MainView } from "./gui/components/MainView";
import { normalizeStyles } from "./common/styles/normalizeStyles";

initializeIcons(); // Ensures all icons are available.
listenForShortcuts(); // Hooks up keyboard listening.
normalizeStyles(); // Overrides bad user agent styling.

// Renders based on virtual URL.
const routing = (
  <Switch>
    <Route path="/" component={MainView} />
  </Switch>
);

// Injects the App component at the root DOM.
ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>{routing}</Router>
  </Provider>,
  document.getElementById("root")
);
