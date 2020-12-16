import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { initializeIcons, loadTheme } from "office-ui-fabric-react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { listenForShortcuts } from "./common/commands/shortcutManager";
import { RunnerEditorView } from "./gui/runner-editor/RunnerEditorView";
import { store } from "./store";
import { Themes, themes } from "./common/themes";

initializeIcons(); // Ensures all icons are available.
listenForShortcuts(); // Hooks up global key listeners.
loadTheme(themes[Themes.DefaultLight].theme); // Applies the default light theme.

// Renders based on virtual URL.
const routing = (
  <Switch>
    <Route path="/" component={RunnerEditorView} />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>{routing}</HashRouter>
  </Provider>,
  document.getElementById("root")
);
