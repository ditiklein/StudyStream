import { configureStore } from "@reduxjs/toolkit";
import FilesSliceReducer from "./FilesSlice"; 
import authSlice from "./authSlice";
import transcriptReducer from "./TranscriptSlice";
 import keyPointsReducer from "./KeyPointsSlice";
import uploadReducer from './UoloadSlice'; // הנתיב בהתאם למיקום הקובץ
import messageReducer from './MessageSlice'; // הנתיב בהתאם למיקום הקובץ



const store = configureStore({
  reducer: {
    files: FilesSliceReducer,
    auth: authSlice, 
    transcript: transcriptReducer,
    keyPoints: keyPointsReducer,
   upload: uploadReducer,
  messages: messageReducer,


 
  },
});

export type Rootstore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
