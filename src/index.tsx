import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { initializeIcons } from "office-ui-fabric-react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { listenForShortcuts } from "./common/commands/shortcutManager";
import { RunnerEditorView } from "./gui/runner-editor/RunnerEditorView";
import { store } from "./store";

initializeIcons(); // Ensures all icons are available.
listenForShortcuts(); // Hooks up global key listeners.

// Renders based on virtual URL.
const routing = (
  <Switch>
    <Route path="/" component={RunnerEditorView} />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename={process.env.PUBLIC_URL}>{routing}</HashRouter>
  </Provider>,
  document.getElementById("root")
);
