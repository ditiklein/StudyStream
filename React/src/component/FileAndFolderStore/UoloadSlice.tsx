import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UploadState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  presignedUrl: string | null;
}

const initialState: UploadState = {
  status: 'idle',
  error: null,
  presignedUrl: null,
};

// Thunk לשליפת Presigned URL מהשרת
export const fetchPresignedUrl = createAsyncThunk<
  string,                  // מה מוחזר ב־fulfilled
  string,                  // מה מתקבל כ־argument (fileName)
  { rejectValue: string }  // מה מוחזר ב־rejected
>(
  'upload/fetchPresignedUrl',
  async (fileName, thunkAPI) => {
    try {
      console.log("fileNamefileNamefileName",fileName);
      
      const response = await axios.get('/upload/presigned-url', {
        params: { fileName },
      });

      const { url } = response.data;
      console.log("gggg",url);
      
      return url;
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to fetch presigned URL';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Thunk להעלאת קובץ בפועל ל־S3
export const uploadFileToS3 = createAsyncThunk(
  'upload/uploadFileToS3',
  
  async ({ file, url }: { file: File, url: string }, thunkAPI) => {
      console.log("d'fghjkjhgfrew",url);

    try {
    const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
  
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to upload file to S3');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.presignedUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresignedUrl.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPresignedUrl.fulfilled, (state, action) => {
        state.status = 'success';
        state.presignedUrl = action.payload;
      })
      .addCase(fetchPresignedUrl.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })
      .addCase(uploadFileToS3.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadFileToS3.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(uploadFileToS3.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  }
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;
 