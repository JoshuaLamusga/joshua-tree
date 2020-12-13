import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ISettingState, settings } from "./common/settings/settings.reducers";
import { IPersistenceState, persistence } from "./common/storage/persistence.reducers";
import { IViewEditState, viewEdit } from "./common/redux/viewedit.reducers";
import { IAuthorStorySettingsState, authorStorySettings } from "./common/redux/authorStorySettings.reducers";
import { IPlayerStorySettingsState, playerStorySettings } from "./common/redux/playerStorySettings.reducers";
import { ICurrentRunnerSettingsState, currentRunnerSettings } from "./common/redux/currentRunnerSettings.reducers";

/** All reducers. */
export interface IRootState {
  persistence: IPersistenceState;
  settings: ISettingState;
  viewEdit: IViewEditState;
  authorStorySettings: IAuthorStorySettingsState;
  currentRunnerSettings: ICurrentRunnerSettingsState;
  playerStorySettings: IPlayerStorySettingsState;
}

const rootReducer = combineReducers({
  persistence,
  settings,
  viewEdit,
  authorStorySettings,
  currentRunnerSettings,
  playerStorySettings,
});

/** Provides global access to the static Redux store. */
export const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
