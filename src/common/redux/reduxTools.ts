let uniqueActionType = Number.MIN_SAFE_INTEGER;

/**
 * Action types must be unique across all reducers.
 * This assigns a globally unique id every time it's called.
 */
export const getActionGuid = () => {
  return (++uniqueActionType).toString();
};
