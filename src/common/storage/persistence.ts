import { IRootState } from "../../store";
import { ILocalizedStringSets } from "../localization/Localization";
import { ISupportedThemes, themes } from "../theming/themes";

const persistStateVersion = 1;
const persistStateIdentifier = "CrystalKeeperOnline";

/** The object states to persist to local storage. */
export interface IPersistentState {
  themeName: keyof ISupportedThemes;
  localeId: keyof ILocalizedStringSets;
  saveFormatVersion: number;
}

/**
 * Saves the given state to local storage. Users must accept the storage policy for data that
 * isn't essential to the service or anything that helps identify an individual.
 */
export const saveToLocalStorage = (state: IRootState) => {
  if (!state.persistence.userConsentProvided) {
    return;
  }

  let themeName = "";
  Object.keys(themes).forEach((key: string) => {
    const candidateThemeName = themes[key as keyof ISupportedThemes].localizedName;
    if (candidateThemeName === state.settings.theme.localizedName) {
      themeName = key;
    }
  });

  const newState: IPersistentState = {
    localeId: state.settings.locale,
    saveFormatVersion: persistStateVersion,
    themeName: themeName as keyof ISupportedThemes,
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
  if (!returnedState.localeId || !returnedState.themeName || !returnedState.saveFormatVersion) {
    return null;
  }

  return returnedState as IPersistentState;
};
