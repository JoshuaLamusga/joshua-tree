import { getActionGuid } from "../../common/redux/reduxTools";
import { IPlayerStorySettingsState } from "./playerStorySettings.reducers";

export const actions = {
  openColorPicker: getActionGuid(),
  closeColorPicker: getActionGuid(),
};

/** Opens the color picker to change a color. */
export const openColorPicker = (color: "colorDark" | "colorLight", forStyle: keyof IPlayerStorySettingsState) => {
  return {
    color,
    forStyle,
    type: actions.openColorPicker,
  };
};

/* Closes the color picker. */
export const closeColorPicker = {
  type: actions.closeColorPicker,
};
