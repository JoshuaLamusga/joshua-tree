import { combineReducers, Dispatch } from "redux";
import * as actions from "./currentRunnerSettings.actions";
import * as types from "./typedefs";

const currentRunnerOptions = (state = {}, action: ReturnType<typeof actions.setCurrentRunnerOptions>) => {
  if (action.type === actions.actions.setCurrentRunnerOptions) {
    return action.options;
  }
  if (action.type === actions.actions.clearAllTempSettings) {
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
