import { combineReducers, Dispatch } from "redux";
import * as actions from "./currentRunnerSettings.actions";
import { IAction } from "./reduxTools";
import * as types from "./typedefs";
import { newStory } from "./viewedit.actions";

const currentRunnerOptions = (state = {}, action: IAction) => {
  if (action.type === actions.actions.setCurrentRunnerOptions) {
    return (action as ReturnType<typeof actions.setCurrentRunnerOptions>).options;
  }
  if (action.type === actions.actions.clearAllTempSettings) {
    return {};
  }
  if (action.type === newStory.type) {
    return {};
  }

  return state;
};

export const dispatchClearAllTempSettings = (dispatch: Dispatch) => {
  dispatch(actions.clearAllTempSettings);
};

export const dispatchSetTempStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IAuthorRunnerOptions) => {
  dispatch(actions.setCurrentRunnerOptions(options));
};

// Combine reducers and typescript definition.
export interface ICurrentRunnerSettingsState {
  currentRunnerSettings: types.IAuthorRunnerOptions;
}

export const currentRunnerSettings = combineReducers({
  currentRunnerOptions,
});
