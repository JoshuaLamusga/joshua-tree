import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { initializeIcons, loadTheme } from "office-ui-fabric-react";
import { HashRouter } from "react-router-dom";
import { listenForShortcuts } from "./common/commands/shortcutManager";
import { store } from "./store";
import { Themes, themes } from "./common/themes";
import { Routing } from "./common/routing/Routing";

initializeIcons(); // Ensures all icons are available.
listenForShortcuts(); // Hooks up global key listeners.
loadTheme(themes[Themes.Default].theme); // Applies the default light theme.

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Routing />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
