import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rootstore } from "./FileStore";
import api from "./Api";
import TranscriptDTO from "../../Modles/Transcript";


  

interface TranscriptState {
  transcript: TranscriptDTO | null;
  downloadUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TranscriptState = {
  transcript: null,
  downloadUrl: null,
  loading: false,
  error: null,
};

// שליפת תמלול לפי מזהה שיעור
export const fetchTranscriptByLessonId = createAsyncThunk(
  "transcript/fetchByLessonId",
  async (lessonId: number, thunkAPI) => {
    try {
      const response = await api.get<TranscriptDTO>(`/Transcript/lesson/${lessonId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch transcript");
    }
  }
);

// שליפת URL זמני להורדת קובץ לפי שם הקובץ
export const fetchTranscriptTextFromS3 = createAsyncThunk<
  string, // מה שיחזור ב־payload אם הצליח
  string  // הפרמטר שנשלח - transcriptUrl
>("transcript/fetchTranscriptTextFromS3", async (transcriptUrl, thunkAPI) => {
  try {
    const presignedRes = await fetch(`http://localhost:5220/api/upload/download-url/${transcriptUrl}`);
    if (!presignedRes.ok) throw new Error("Failed to get signed URL");

    const downloadUrl = await presignedRes.text();
    const transcriptRes = await fetch(downloadUrl);
    if (!transcriptRes.ok) throw new Error("Failed to fetch transcript from S3");

    const transcriptText = await transcriptRes.text();
    return transcriptText;
  } catch (error) {
    return thunkAPI.rejectWithValue("שגיאה בהורדת תמלול");
  }
});

const transcriptSlice = createSlice({
  name: "transcript",
  initialState,
  reducers: {
    clearTranscriptState: (state) => {
      state.transcript = null;
      state.downloadUrl = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranscriptByLessonId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transcript = null;
      })
      .addCase(fetchTranscriptByLessonId.fulfilled, (state, action: PayloadAction<TranscriptDTO>) => {
        state.loading = false;
        state.transcript = action.payload;
      })
      .addCase(fetchTranscriptByLessonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTranscriptTextFromS3.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.downloadUrl = null;
      })
      .addCase(fetchTranscriptTextFromS3.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.downloadUrl = action.payload;
      })
      .addCase(fetchTranscriptTextFromS3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTranscriptState } = transcriptSlice.actions;

export const selectTranscript = (state: Rootstore) => state.transcript;

export default transcriptSlice.reducer;
