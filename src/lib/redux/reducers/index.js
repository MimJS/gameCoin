import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { configReducer } from "./configReducer";
import { uiReducer } from "./uiReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  config: configReducer,
  ui: uiReducer,
});
