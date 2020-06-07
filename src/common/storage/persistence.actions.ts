import { getActionGuid } from "../redux/reduxTools";

export const actions = {
  setCustomizationApplied: getActionGuid(),
  setUserConsentProvided: getActionGuid(),
};

/** Action creator to store whether the user has provided consent to using local storage. */
export const setUserConsentProvided = (consentProvided: boolean) => {
  return {
    consentProvided,
    type: actions.setUserConsentProvided,
  };
};

/** Action creator to store (lowercase) preferred locale id such as en-us. */
export const setCustomizationApplied = (isApplied: boolean) => {
  return {
    isApplied,
    type: actions.setCustomizationApplied,
  };
};
