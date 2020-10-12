import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { ISettingState, settings } from "./common/settings/settings.reducers";
import { IPersistenceState, persistence } from "./common/storage/persistence.reducers";
import { IViewEditState, viewEdit } from "./common/redux/viewedit.reducers";

/** All reducers. */
export interface IRootState {
  persistence: IPersistenceState;
  settings: ISettingState;
  viewEdit: IViewEditState;
}

const rootReducer = combineReducers({
  persistence,
  settings,
  viewEdit,
});

/** Provides global access to the static Redux store. */
export const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
