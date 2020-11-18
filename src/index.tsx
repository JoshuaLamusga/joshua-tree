import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { initializeIcons } from "office-ui-fabric-react";
import { Route, Router, Switch } from "react-router";
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
    <Router history={createBrowserHistory()}>{routing}</Router>
  </Provider>,
  document.getElementById("root")
);
