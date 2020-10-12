import { getActionGuid } from "./reduxTools";

export const actions = {
  rerenderStory: getActionGuid(),
  saveAndRunStory: getActionGuid(),
  updateStory: getActionGuid(),
};

/** Re-renders the visual state of the interpreter.  */
export const rerenderStory = {
  type: actions.rerenderStory,
};

/** Runs the story and save as needed. */
export const saveAndRunStory = (story: string) => {
  return {
    story,
    type: actions.saveAndRunStory,
  };
};

/** Updates the contents of the story. */
export const updateStory = (story: string) => {
  return {
    story,
    type: actions.updateStory,
  };
};
