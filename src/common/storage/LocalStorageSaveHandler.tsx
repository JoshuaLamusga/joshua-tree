import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IRootState } from "../../store";
import { ILocalizedStringSets } from "../localization/Localization";
import { Themes, themes } from "../themes";

const persistStateVersion = 1;
const persistStateIdentifier = "JoshuaTree";

/** The object states to persist to local storage. */
interface IPersistentState {
  localeId: keyof ILocalizedStringSets;
  saveFormatVersion: number;
  theme: keyof typeof themes;
}

/** The state variables that, when changed, trigger an attempt to save to local storage. */
interface ISaveToLocalStorageProps {
  theme: IRootState["settings"]["theme"];
  locale: IRootState["settings"]["locale"];
  userConsentProvided: IRootState["persistence"]["userConsentProvided"];
}

/**
 * Saves the given state to local storage. Users must accept the storage policy for data that
 * isn't essential to the service or anything that helps identify an individual.
 */
const saveToLocalStorage = (state: ISaveToLocalStorageProps) => {
  if (!state.userConsentProvided) {
    return;
  }

  let theme = Themes.DefaultLight;
  const themeKeys = (Object.keys(themes) as unknown) as (keyof typeof themes)[];

  themeKeys.forEach((key: Themes) => {
    const candidateThemeName = themes[key].localizedName;
    if (candidateThemeName === state.theme.localizedName) {
      theme = key;
    }
  });

  const newState: IPersistentState = {
    localeId: state.locale,
    saveFormatVersion: persistStateVersion,
    theme: theme,
  };

  localStorage.setItem(persistStateIdentifier, JSON.stringify(newState));
};

/**
 * Loads the given state from local storage. Users must have accepted the storage policy for data
 * that isn't essential to the service or anything that helps identify an individual. Returns null
 * if a key isn't found. The state returned on success contains all keys, though their values
 * aren't checked for accuracy.
 */
export const loadFromLocalStorage = (): IPersistentState | null => {
  const loadedState = localStorage.getItem(persistStateIdentifier);
  if (loadedState === null) {
    return null;
  }

  let returnedState: Partial<IPersistentState> = {};

  try {
    returnedState = JSON.parse(loadedState) as Partial<IPersistentState>;
  } catch {
    return null;
  }

  // All keys must exist before the state can be considered complete.
  if (!returnedState.localeId || !returnedState.theme || !returnedState.saveFormatVersion) {
    return null;
  }

  return returnedState as IPersistentState;
};

const mapStateToProps = (state: IRootState): ISaveToLocalStorageProps => {
  return {
    locale: state.settings.locale,
    theme: state.settings.theme,
    userConsentProvided: state.persistence.userConsentProvided,
  };
};

type LocalStorageSaveHandlerOwnProps = {};
type LocalStorageSaveHandlerPropsWithRouteInfo = LocalStorageSaveHandlerOwnProps & RouteComponentProps;
type CombinedProps = LocalStorageSaveHandlerPropsWithRouteInfo & ReturnType<typeof mapStateToProps>;

export class LocalStorageSaveHandlerC extends React.Component<LocalStorageSaveHandlerPropsWithRouteInfo> {
  public componentDidUpdate(prevProps: CombinedProps) {
    const props = this.props as CombinedProps;

    /**
     * Any change of value connected to this component should trigger a save to local storage if allowed, except
     * userConsentProvided.
     */
    if (prevProps.userConsentProvided === props.userConsentProvided) {
      saveToLocalStorage(this.props as CombinedProps);
    }
  }

  public render() {
    return <></>;
  }
}

/** Hooks up actions, some of which require current state or history, to commands. */
export const LocalStorageSaveHandler = connect(mapStateToProps)(withRouter(LocalStorageSaveHandlerC));
