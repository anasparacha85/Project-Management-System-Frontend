import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

import TaskReducer from '../Slices/TaskSlice'
import ProjectReducer from '../Slices/ProjectSlice'
import UIReducer from '../Slices/UiSlice'
import SubTaskReducer from '../Slices/SubTaskSlice'
import UserReducer from '../Slices/UserSlice'
import NotificationReducer from '../Slices/NotificationSLice'

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
   Task: TaskReducer,
   Project: ProjectReducer,
   UserInterface:UIReducer,
   SubTask:SubTaskReducer,
   User:UserReducer,
   Notification:NotificationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;