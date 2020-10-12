import { combineReducers, Dispatch } from "redux";
import { actions, updateStory, saveAndRunStory, rerenderStory } from "./viewedit.actions";

/**
 * Contains the up-to-date text for the story, which is updated when loading a story, adding to
 * it with GUI controls, trying to run the story after editing the source, or blurring the textarea
 * after editing the source.
 */
const story = (state = "", action: ReturnType<typeof updateStory | typeof saveAndRunStory>) => {
  if (action.type === actions.updateStory) {
    return action.story;
  }
  if (action.type === actions.saveAndRunStory) {
    return action.story;
  }

  return state;
};

/**
 * Contains the copy of the story from when it was last executed, which may be older than the
 * current story. Updating this causes the story to execute again.
 */
const storyToParse = (state = "", action: ReturnType<typeof saveAndRunStory>) => {
  if (action.type === actions.saveAndRunStory) {
    return action.story;
  }

  return state;
};

/** Uses a number to indicate that the runner should re-render. */
const storyRerenderToken = (state = 0, action: typeof rerenderStory) => {
  if (action.type === actions.rerenderStory) {
    return state + 1;
  }

  return state;
};

/** Sets the story that the user has typed. */
export const dispatchSetStory = (dispatch: Dispatch) => (story: string) => {
  dispatch(updateStory(story));
};

/** Parses the story as currently written, updating the stored story to match the provided string. */
export const dispatchSaveAndRunStory = (dispatch: Dispatch) => (story: string) => {
  dispatch(saveAndRunStory(story));
};

/** Causes the story to re-render. */
export const dispatchRerenderStory = (dispatch: Dispatch) => () => {
  dispatch(rerenderStory);
};

// Combine reducers and typescript definition.
export interface IViewEditState {
  story: string;
  storyRerenderToken: string;
  storyToParse: string;
}

export const viewEdit = combineReducers({
  story,
  storyRerenderToken,
  storyToParse,
});
