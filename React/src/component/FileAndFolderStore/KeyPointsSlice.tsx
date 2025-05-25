import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "./Api"; // ייבוא של ה־API שלך או fetch אם אתה משתמש בו ישירות
import { Rootstore } from "./FileStore";

interface KeyPointsState {
  keyPoints: string | null; // נקודות חשובות
  summary: string | null; // סיכום
  loading: boolean;
  error: string | null;
}

const initialState: KeyPointsState = {
  keyPoints: null,
  summary: null,
  loading: false,
  error: null,
};

// שליחת בקשה לחילוץ נקודות חשובות
export const extractKeyPoints = createAsyncThunk(
  "keyPoints/extractKeyPoints",
  async (text: string, thunkAPI) => {
    try {
      const response = await api.post("/extract-keypoints", { text });
      return response.data.keyPoints;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בחילוץ נקודות חשובות");
    }
  }
);

// שליחת בקשה לסיכום השיעור
export const summarizeLesson = createAsyncThunk(
  "keyPoints/summarizeLesson",
  async (text: string, thunkAPI) => {
    try {
      const response = await api.post("/summarize-lesson", { text });
      return response.data.summary;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בסיכום השיעור");
    }
  }
);

const keyPointsSlice = createSlice({
  name: "keyPoints",
  initialState,
  reducers: {
    clearKeyPointsState: (state) => {
      state.keyPoints = null;
      state.summary = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // עבור חילוץ נקודות חשובות
      .addCase(extractKeyPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(extractKeyPoints.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.keyPoints = action.payload;
      })
      .addCase(extractKeyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // עבור סיכום שיעור
      .addCase(summarizeLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(summarizeLesson.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(summarizeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearKeyPointsState } = keyPointsSlice.actions;

export const selectKeyPoints = (state: Rootstore) => state.keyPoints;

export default keyPointsSlice.reducer;
