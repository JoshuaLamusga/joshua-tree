import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ISettingState, settings } from "./common/settings/settings.reducers";
import { IPersistenceState, persistence } from "./common/storage/persistence.reducers";

// Combine reducers and typescript definition.
export interface IRootState {
  persistence: IPersistenceState;
  settings: ISettingState;
}

const rootReducer = combineReducers({
  persistence,
  settings,
});

/** Provides global access to the static Redux store. */
export const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
