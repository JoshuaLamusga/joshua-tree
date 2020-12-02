import { combineReducers, Dispatch } from "redux";
import * as actions from "./authorStorySettings.actions";
import * as types from "./typedefs";

const authorStoryInputStyles = (state = {}, action: ReturnType<typeof actions.setAuthorStoryInputStyles>) => {
  if (action.type === actions.actions.setAuthorStoryInputStyles) {
    return action.style;
  }

  return state;
};

const authorStoryLogSeparatorStyles = (
  state = {},
  action: ReturnType<typeof actions.setAuthorStoryLogSeparatorStyles>
) => {
  if (action.type === actions.actions.setAuthorStoryLogSeparatorStyles) {
    return action.style;
  }

  return state;
};

const authorStoryOptionStyles = (state = {}, action: ReturnType<typeof actions.setAuthorStoryOptionStyles>) => {
  if (action.type === actions.actions.setAuthorStoryOptionStyles) {
    return action.style;
  }

  return state;
};

const authorStoryOptionHighlightStyles = (
  state = {},
  action: ReturnType<typeof actions.setAuthorStoryOptionHighlightStyles>
) => {
  if (action.type === actions.actions.setAuthorStoryOptionHighlightStyles) {
    return action.style;
  }

  return state;
};

const authorStoryOutputStyles = (state = {}, action: ReturnType<typeof actions.setAuthorStoryOutputStyles>) => {
  if (action.type === actions.actions.setAuthorStoryOutputStyles) {
    return action.style;
  }

  return state;
};

const authorStoryRunnerOptions = (state = {}, action: ReturnType<typeof actions.setAuthorStoryRunnerOptions>) => {
  if (action.type === actions.actions.setAuthorStoryRunnerOptions) {
    return action.options;
  }

  return state;
};

const authorStoryRunnerStyles = (state = {}, action: ReturnType<typeof actions.setAuthorStoryRunnerStyles>) => {
  if (action.type === actions.actions.setAuthorStoryRunnerStyles) {
    return action.style;
  }

  return state;
};

export const dispatchSetAuthorStoryInputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryInputStyles(style));
};

export const dispatchSetAuthorStoryLogSeparatorStyles = (dispatch: Dispatch) => (
  style: types.IRunnerLogSeparatorStyle
) => {
  dispatch(actions.setAuthorStoryLogSeparatorStyles(style));
};

export const dispatchSetAuthorStoryOptionStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOptionStyles(style));
};

export const dispatchSetAuthorStoryOptionHighlightStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOptionHighlightStyles(style));
};

export const dispatchSetAuthorStoryOutputStyles = (dispatch: Dispatch) => (style: types.ITextStyle) => {
  dispatch(actions.setAuthorStoryOutputStyles(style));
};

export const dispatchSetAuthorStoryRunnerOptions = (dispatch: Dispatch) => (options: types.IRunnerOptions) => {
  dispatch(actions.setAuthorStoryRunnerOptions(options));
};

export const dispatchSetAuthorStoryRunnerStyles = (dispatch: Dispatch) => (style: types.IRunnerStyle) => {
  dispatch(actions.setAuthorStoryRunnerStyles(style));
};

// Combine reducers and typescript definition.
export interface IAuthorStorySettingsState {
  authorStoryInputStyles: string;
  authorStoryLogSeparatorStyles: string;
  authorStoryOptionStyles: string;
  authorStoryOptionHighlightStyles: string;
  authorStoryOutputStyles: string;
  authorStoryRunnerOptions: string;
  authorStoryRunnerStyles: string;
}

export const authorStorySettings = combineReducers({
  authorStoryInputStyles,
  authorStoryLogSeparatorStyles,
  authorStoryOptionStyles,
  authorStoryOptionHighlightStyles,
  authorStoryOutputStyles,
  authorStoryRunnerOptions,
  authorStoryRunnerStyles,
});
