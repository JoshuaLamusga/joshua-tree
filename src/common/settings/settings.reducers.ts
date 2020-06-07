import { loadTheme } from "office-ui-fabric-react";
import { combineReducers, Dispatch } from "redux";
import { getSupportedLocale, ILocalizedStringSets } from "../localization/Localization";
import { ISupportedTheme, themes } from "../theming/themes";
import { actions, setLocale, setTheme } from "./settings.actions";

/** The user's preferred theme. An empty string here should mean the default theme is applied. */
const theme = (
  state: ISupportedTheme = {
    localizedName: themes.default.localizedName,
    theme: loadTheme(themes.default.theme),
  },
  action: ReturnType<typeof setTheme>
) => {
  if (action.type === actions.setTheme) {
    return action.theme;
  }

  return state;
};

/** Sets the full theme based on a partial theme and injects it to update components. */
export const dispatchSetTheme = (dispatch: Dispatch) => async (supportedTheme: ISupportedTheme) => {
  const wholeTheme = loadTheme(supportedTheme.theme);
  document.body.style.backgroundColor = wholeTheme.semanticColors.bodyBackground;

  await dispatch(setTheme({ localizedName: supportedTheme.localizedName, theme: wholeTheme }));
};

/** The user's preferred language. */
const locale = (state = getSupportedLocale(), action: ReturnType<typeof setLocale>) => {
  if (action.type === actions.setLocale) {
    return action.localeId;
  }

  return state;
};

/** Sets the locale id in lowercase, such as en-us. */
export const dispatchSetLocale = (dispatch: Dispatch) => async (
  localeId: keyof ILocalizedStringSets
) => {
  dispatch(setLocale(localeId));
};

// Combine reducers and typescript definition.
export interface ISettingState {
  locale: keyof ILocalizedStringSets;
  theme: ISupportedTheme;
}

export const settings = combineReducers({
  locale,
  theme,
});
