import { 
   createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Rootstore } from "./FileStore";

// 🔹 שליפת תיקיות ראשיות (תיקיות ללא תיקיית אב)
const fetchData = async (urls: string[]) => {
  const results = await Promise.allSettled(urls.map(url => axios.get(url)));
  return results.map(result => result.status === "fulfilled" ? result.value.data : []);
};


// בreducer

export const fetchUserFolders = createAsyncThunk(
  "folders/fetchUserFolders",
  async (ownerId: number, thunkAPI) => {
    try {
      const response = await axios.get(`https://localhost:7147/api/Folder/user/${ownerId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const fetchUserFiles = createAsyncThunk(
  "files/fetchUserFiles",
  async (ownerId: number, thunkAPI) => {
    try {
      const response = await axios.get(`https://localhost:7147/api/Lesson/lessons/user/${ownerId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);



export const fetchRootFolders = createAsyncThunk(
  "folders/fetchRoot",
  async (ownerId: number, thunkAPI) => {
    try {
      const [folders, files] = await fetchData([
        `https://localhost:7147/api/Folder/root/${ownerId}`,
        `https://localhost:7147/api/Lesson/root/${ownerId}`
      ]);
      return { folders, files };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const fetchSubFoldersAndFiles = createAsyncThunk(
  "folders/fetchSubFoldersAndFiles",
  async (
    { parentFolderId, ownerId }: { parentFolderId: number; ownerId: number },
    thunkAPI
  ) => {
    try {
      const [folders, files] = await fetchData([
        `https://localhost:7147/api/Folder/subfolders/${parentFolderId}/user/${ownerId}`,
        `https://localhost:7147/api/Lesson/lessons/${parentFolderId}`
      ]);
      return { folders, files };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

// 🔹 הוספת תיקייה חדשה
export const addFolder = createAsyncThunk(
  "folders/addFolder",
  async ({ name, ownerId, parentFolderId }: { name: string; ownerId: number; parentFolderId: number | null }, thunkAPI) => {
    try {
      const response = await axios.post("https://localhost:7147/api/Folder", {
        name,
        ownerId,
        parentFolderId: parentFolderId ?? null, // אם אין הורה, שולחים null
      });

      return response.data; // מחזירים את התיקייה החדשה שנוצרה
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 הוספת קובץ
export const addFile = createAsyncThunk(
  "folders/addFile",
  async ({ lessonName, ownerId, fileType, url, folderId }: { lessonName: string; ownerId: number; fileType: string; url: string; folderId: number | null }, thunkAPI) => {
    try {
      const response = await axios.post("https://localhost:7147/api/Lesson", {
        lessonName,
        ownerId,
        fileType,
        url,
        folderId: folderId ?? null, // אם אין הורה, שולחים null
      });
      return response.data; // מחזירים את הקובץ החדש שנוצר
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 עדכון תיקייה
export const updateFolder = createAsyncThunk(
  "folders/updateFolder",
  async (
    { id, name, ownerId ,parentFolderId}: { id: number; name: string; ownerId: number ,parentFolderId: number|null},
    thunkAPI
  ) => {
    try {
      console.log(id, name, ownerId ,parentFolderId);
      
      const response = await axios.put(
        `https://localhost:7147/api/Folder/${id}`,
        {
          name,
          ownerId,
          parentFolderId
        }
      );
      console.log(response);
      
      return response.data; // מחזירים את התיקייה לאחר העדכון
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 מחיקת תיקייה
export const deleteFolder = createAsyncThunk(
  "folders/deleteFolder",
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.delete(`https://localhost:7147/api/Folder/${id}`);
      return { id }; // מחזירים את ה-ID של התיקייה שנמחקה
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 עדכון קובץ
export const updateFile = createAsyncThunk(
  "files/updateFile",
  async ({ id, lessonName, ownerId,folderId, fileType, url }: { id: number; lessonName: string; ownerId: number;folderId:number|null; fileType: string; url: string }, thunkAPI) => {
    try {
      const response = await axios.put(
        `https://localhost:7147/api/Lesson/${id}`,
        {
          lessonName,
          ownerId,
          folderId,
          fileType,
          url,
        }
      );
      return response.data; // מחזירים את הקובץ לאחר העדכון
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 מחיקת קובץ
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.delete(`https://localhost:7147/api/Lesson/${id}`);
      return { id }; // מחזירים את ה-ID של הקובץ שנמחק
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const FilesSlice = createSlice({
  name: "files",
  initialState: {
    folders: [] as any[], // רשימת תיקיות
    files: [] as any[], 
    allUserFolders: [] as any[],
    allUserFiles: [] as any[],
    loading: false, // מצב טעינה
    error: null as string | null, // הודעת שגיאה במידה ויש
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 סטטוס טעינה עבור חיפוש תיקיות
      .addCase(fetchRootFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(fetchRootFolders.fulfilled, (state, action: PayloadAction<{ folders: any[]; files: any[] }>) => {
        state.loading = false;
        state.folders = action.payload.folders;
        state.files = action.payload.files;
      })
      .addCase(fetchRootFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch root folders";
      })

      // 🔄 סטטוס טעינה עבור חיפוש קבצים
      .addCase(fetchSubFoldersAndFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubFoldersAndFiles.fulfilled, (state, action: PayloadAction<{ folders: any[]; files: any[] }>) => {
        state.loading = false;
        state.folders = action.payload.folders;
        state.files = action.payload.files;
      })
      .addCase(fetchSubFoldersAndFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch subfolders and files";
      })

      // ➕ הוספת תיקייה
      .addCase(addFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFolder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.folders.push(action.payload); // מוסיפים את התיקייה החדשה לסטור
      })
      .addCase(addFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to add folder";
      })

      // ➕ הוספת קובץ
      .addCase(addFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.files.push(action.payload); // מוסיפים את הקובץ החדש לרשימה
      })
      .addCase(addFile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to add file";
      })

      // 🔄 סטטוס טעינה עבור עדכון תיקייה
      .addCase(updateFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedFolder = action.payload;
        const index = state.folders.findIndex((folder) => folder.id === updatedFolder.id);
        if (index !== -1) {
          state.folders[index] = updatedFolder;
        }
      })
      
      

      
      .addCase(updateFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to update folder";
      })

      // 🔄 סטטוס טעינה עבור מחיקת תיקייה
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.folders = state.folders.filter((folder) => folder.id !== action.payload.id);
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to delete folder";
      })

      // 🔄 סטטוס טעינה עבור מחיקת קובץ
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.files = state.files.filter((file) => file.id !== action.payload.id);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to delete file";
      })

      // 🔄 סטטוס טעינה עבור עדכון קובץ
      .addCase(updateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedFile = action.payload;
        const index = state.files.findIndex((file) => file.id === updatedFile.id);
        if (index !== -1) {
          state.files[index] = updatedFile;
        }
      })
      
            .addCase(updateFile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to update file";
      })
      .addCase(fetchUserFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFolders.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.allUserFolders = action.payload;
      })
      .addCase(fetchUserFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user folders";
      })
      .addCase(fetchUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.allUserFiles = action.payload;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user files";
      });
  },
});

export const selectFoldersAndFiles = (state: Rootstore) => state.files;

export default FilesSlice.reducer;
