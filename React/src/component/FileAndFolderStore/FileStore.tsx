import { configureStore } from "@reduxjs/toolkit";
import FilesSliceReducer from "./FilesSlice"; 
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    files: FilesSliceReducer,
    auth: authSlice, 
  },
});

export type Rootstore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
