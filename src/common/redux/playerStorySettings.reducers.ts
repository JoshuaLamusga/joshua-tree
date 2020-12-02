import { combineReducers, Dispatch } from "redux";
import * as actions from "./playerStorySettings.actions";
import * as types from "./typedefs";

const playerStoryInputStyles = (state = {}, action: ReturnType<typeof actions.setPlayerStoryInputStyles>) => {
  if (action.type === actions.actions.setPlayerStoryInputStyles) {
    return action.style;
  }

  return state;
};

const playerStoryLogSeparatorStyles = (
  state = {},
  action: ReturnType<typeof actions.setPlayerStoryLogSeparatorStyles>
) => {
  if (action.type === actions.actions.setPlayerStoryLogSeparatorStyles) {
    return action.style;
  }

  return state;
};

const playerStoryOptionStyles = (state = {}, action: ReturnType<typeof actions.setPlayerStoryOptionStyles>) => {
  if (action.type === actions.actions.setPlayerStoryOptionStyles) {
    return action.style;
  }

  return state;
};

const playerStoryOptionHighlightStyles = (
  state = {},
  action: ReturnType<typeof actions.setPlayerStoryOptionHighlightStyles>
) => {
  if (action.type === actions.actions.setPlayerStoryOptionHighlightStyles) {
    return action.style;
  }

  return state;
};

const playerStoryOutputStyles = (state = {}, action: ReturnType<typeof actions.setPlayerStoryOutputStyles>) => {
  if (action.type === actions.actions.setPlayerStoryOutputStyles) {
    return action.style;
  }

  return state;
};

const playerStoryRunnerOptions = (state = {}, action: ReturnType<typeof actions.setPlayerStoryRunnerOptions>) => {
  if (action.type === actions.actions.setPlayerStoryRunnerOptions) {
    return action.options;
  }

  return state;
};

const playerStoryRunnerStyles = (state = {}, action: ReturnType<typeof actions.setPlayerStoryRunnerStyles>) => {
  if (action.type === actions.actions.setPlayerStoryRunnerStyles) {
    return action.style;
  }

  return state;
};

export const dispatchSetPlayerStoryInputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryInputStyles(style));
};

export const dispatchSetPlayerStoryLogSeparatorStyles = (dispatch: Dispatch) => (
  style: types.IRunnerLogSeparatorStyle
) => {
  dispatch(actions.setPlayerStoryLogSeparatorStyles(style));
};

export const dispatchSetPlayerStoryOptionStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOptionStyles(style));
};

export const dispatchSetPlayerStoryOptionHighlightStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOptionHighlightStyles(style));
};

export const dispatchSetPlayerStoryOutputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setPlayerStoryOutputStyles(style));
};

export const dispatchSetPlayerStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IRunnerOptions) => {
  dispatch(actions.setPlayerStoryRunnerOptions(options));
};

export const dispatchSetPlayerStoryRunnerStyles = (dispatch: Dispatch) => (style: types.IRunnerStyle) => {
  dispatch(actions.setPlayerStoryRunnerStyles(style));
};

// Combine reducers and typescript definition.
export interface IPlayerStorySettingsState {
  playerStoryInputStyles: string;
  playerStoryLogSeparatorStyles: string;
  playerStoryOptionStyles: string;
  playerStoryOptionHighlightStyles: string;
  playerStoryOutputStyles: string;
  playerStoryRunnerOptions: string;
  playerStoryRunnerStyles: string;
}

export const playerStorySettings = combineReducers({
  playerStoryInputStyles,
  playerStoryLogSeparatorStyles,
  playerStoryOptionStyles,
  playerStoryOptionHighlightStyles,
  playerStoryOutputStyles,
  playerStoryRunnerOptions,
  playerStoryRunnerStyles,
});
