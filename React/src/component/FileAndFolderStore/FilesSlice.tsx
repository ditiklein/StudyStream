


import { 
   createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import  { AxiosError } from "axios";
import { Rootstore } from "./FileStore";
import api from "./Api";
import { CreateFolderRequest, Folder, UpdateFolderRequest } from "../../Modles/Folder";
import { CreateLessonRequest, Lesson, UpdateLessonRequest } from "../../Modles/File";
// או מהמקום שבו הגדרת את הטיפוסים

// סטייט של ה-slice
interface FilesState {
  folders: Folder[];
  files: Lesson[];
  allUserFolders: Folder[];
  allUserFiles: Lesson[];
  searchFoldersResults: Folder[];
  searchFilesResults: Lesson[];
  loading: boolean;
  error: string | null;
}

// 🔹 שליפת תיקיות ראשיות (תיקיות ללא תיקיית אב)
const fetchData = async (urls: string[]) => {
  console.log(urls);
  const results = await Promise.allSettled(urls.map(url => api.get(url)));
  return results.map(result => result.status === "fulfilled" ? result.value.data : []);
};
export const downloadFolderAsZip = createAsyncThunk(
  "folders/downloadFolderAsZip",
  async ({ folderId, folderName }: { folderId: number; folderName?: string }, thunkAPI) => {
    try {
      console.log(`🔄 מתחיל הורדת תיקייה ${folderId} כ-ZIP...`);
      
      // קריאה לשרת עם responseType blob
      const response = await api.get(`/upload/download-folder-zip/${folderId}`, {
        responseType: 'blob',
        timeout: 300000, // 5 דקות timeout עבור קבצים גדולים
      });
      
      console.log(`✅ קובץ ZIP נוצר בהצלחה, גודל: ${response.data.size} bytes`);
      
      // יצירת Blob מהתגובה
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      
      // יצירת שם קובץ
      const fileName = folderName ? `${folderName}.zip` : `folder_${folderId}.zip`;
      
      // יצירת לינק להורדה אוטומטית
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // הוספה למסמך, לחיצה והסרה
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // ניקוי ה-URL לחיסכון בזיכרון
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log(`📥 הורדת ${fileName} החלה...`);
      
      return { 
        success: true, 
        fileName,
        folderId 
      };
      
    } catch (error) {
      const err = error as AxiosError;
      console.error(`❌ שגיאה בהורדת תיקייה ${folderId}:`, err);
      
      // הודעת שגיאה ידידותית למשתמש
      let errorMessage = "שגיאה בהורדת התיקייה";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "הורדת התיקייה נכשלה - חסום זמן. נסה שוב מאוחר יותר.";
      } else if (err.response?.status === 404) {
        errorMessage = "התיקייה לא נמצאה";
      } else if (err.response?.status === 403) {
        errorMessage = "אין הרשאה להוריד תיקייה זו";
      } else if (err.response?.status === 500) {
        errorMessage = "שגיאת שרת בעת יצירת קובץ ה-ZIP";
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Async Thunks
export const fetchUserFolders = createAsyncThunk(
  "folders/fetchUserFolders",
  async (ownerId: number, thunkAPI) => {
    try {
      const response = await api.get(`/Folder/folders/${ownerId}`);
      return response.data as Folder[];
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const fetchUserFiles = createAsyncThunk(
  "files/fetchUserFiles",
  async (ownerId: number, thunkAPI) => {
    try {
      const response = await api.get(`/Lesson/lessons/user/${ownerId}`);
      return response.data as Lesson[];
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
        `/Folder/root/${ownerId}`,
        `/Lesson/root/${ownerId}`
      ]);
      return { folders: folders as Folder[], files: files as Lesson[] };
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
        `/Folder/subfolders/${parentFolderId}/user/${ownerId}`,
        `/Lesson/lessons/${parentFolderId}`
      ]);
      return { folders: folders as Folder[], files: files as Lesson[] };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const addFolder = createAsyncThunk(
  "folders/addFolder",
  async ({ name, ownerId, parentFolderId }: CreateFolderRequest, thunkAPI) => {
    try {
      const response = await api.post("/Folder", {
        name,
        ownerId,
        parentFolderId: parentFolderId ?? null,
      });
      return response.data as Folder;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addFile = createAsyncThunk(
  "folders/addFile",
  async ({ lessonName, description, ownerId, fileType, folderId }: CreateLessonRequest, thunkAPI) => {
    try {
      const response = await api.post("/Lesson", {
        lessonName,
        description,
        ownerId,
        fileType,
        folderId: folderId ?? null,
      });
      return response.data as Lesson;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateFolder = createAsyncThunk(
  "folders/updateFolder",
  async ({ id, name, ownerId, parentFolderId }: UpdateFolderRequest, thunkAPI) => {
    try {
      console.log(id, name, ownerId, parentFolderId);
      
      const response = await api.put(`/Folder/${id}`, {
        name,
        ownerId,
        parentFolderId
      });
      console.log(response);
      
      return response.data as Folder;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteFolder = createAsyncThunk(
  "folders/deleteFolder",
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`/Folder/${id}`);
      return { id };
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateFile = createAsyncThunk(
  "files/updateFile",
  async ({ id, lessonName, ownerId, folderId, fileType, url, isDeleted }: UpdateLessonRequest, thunkAPI) => {
    try {
      const response = await api.put(`/Lesson/${id}`, {
        lessonName,
        ownerId,
        folderId,
        fileType,
        url,
        isDeleted
      });
      return response.data as Lesson;
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`/Lesson/${id}`);
      return { id };
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const hardDeleteFile = createAsyncThunk(
  "files/hardDeleteFile",
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`Lesson/harddelete/${id}`);
      return { id };
    } catch (error) {
      const err = error as AxiosError;
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const searchFolders = createAsyncThunk(
  "folders/searchFolders",
  async (
    { userId, currentFolderId, query }: { userId: number; currentFolderId: number | null; query: string },
    thunkAPI
  ) => {
    try {
      const url = currentFolderId === null 
        ? `/Folder/search-folders/?userId=${userId}&query=${query}` 
        : `/Folder/search-folders/?userId=${userId}&folderId=${currentFolderId}&query=${query}`;
      
      const response = await api.get(url);
      return response.data as Folder[];
    } catch (error) {
      console.log("error folder");
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

export const searchFiles = createAsyncThunk(
  "files/searchFiles",
  async (
    { userId, currentFolderId, query }: { userId: number; currentFolderId: number | null; query: string },
    thunkAPI
  ) => {
    try {
      const url = currentFolderId === null 
        ? `/Lesson/search-files/?userId=${userId}&query=${query}` 
        : `/Lesson/search-files/?userId=${userId}&folderId=${currentFolderId}&query=${query}`;
      
      const response = await api.get(url);
      return response.data as Lesson[];
    } catch (error) {
      console.log("errrrrr");
      return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
    }
  }
);

const initialState: FilesState = {
  folders: [],
  files: [],
  allUserFolders: [],
  allUserFiles: [],
  searchFoldersResults: [],
  searchFilesResults: [],
  loading: false,
  error: null,
};

const FilesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
          .addCase(downloadFolderAsZip.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("🔄 מתחיל תהליך הורדת ZIP...");
      })
      .addCase(downloadFolderAsZip.fulfilled, (state, action) => {
        state.loading = false;
        console.log(`✅ הורדת ZIP הושלמה: ${action.payload.fileName}`);
        // אפשר להוסיף notification או הודעת הצלחה כאן
      })
      .addCase(downloadFolderAsZip.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to download folder as ZIP";
        console.error(`❌ הורדת ZIP נכשלה: ${state.error}`);
      })

      // fetchRootFolders
      .addCase(fetchRootFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRootFolders.fulfilled, (state, action: PayloadAction<{ folders: Folder[]; files: Lesson[] }>) => {
        state.loading = false;
        state.folders = action.payload.folders;
        state.files = action.payload.files;
      })
      .addCase(fetchRootFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch root folders";
      })

      // fetchSubFoldersAndFiles
      .addCase(fetchSubFoldersAndFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubFoldersAndFiles.fulfilled, (state, action: PayloadAction<{ folders: Folder[]; files: Lesson[] }>) => {
        state.loading = false;
        state.folders = action.payload.folders;
        state.files = action.payload.files;
      })
      .addCase(fetchSubFoldersAndFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch subfolders and files";
      })

      // addFolder
      .addCase(addFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        state.folders.push(action.payload);
      })
      .addCase(addFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to add folder";
      })

      // addFile
      .addCase(addFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFile.fulfilled, (state, action: PayloadAction<Lesson>) => {
        state.loading = false;
        state.files.push(action.payload);
      })
      .addCase(addFile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to add file";
      })

      // updateFolder
      .addCase(updateFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
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

      // deleteFolder
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

      // deleteFile
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

      // updateFile
      .addCase(updateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFile.fulfilled, (state, action: PayloadAction<Lesson>) => {
        state.loading = false;
        console.log("ssssss");
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

      // fetchUserFolders
      .addCase(fetchUserFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.loading = false;
        state.allUserFolders = action.payload;
      })
      .addCase(fetchUserFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user folders";
      })

      // fetchUserFiles
      .addCase(fetchUserFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action: PayloadAction<Lesson[]>) => {
        state.loading = false;
        state.allUserFiles = action.payload;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user files";
      })

      // hardDeleteFile
      .addCase(hardDeleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hardDeleteFile.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.files = state.files.filter((file) => file.id !== action.payload.id);
      })
      .addCase(hardDeleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to hard delete file";
      })

      // searchFolders
      .addCase(searchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.loading = false;
        state.searchFoldersResults = action.payload;
      })
      .addCase(searchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to search folders";
      })

      // searchFiles
      .addCase(searchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFiles.fulfilled, (state, action: PayloadAction<Lesson[]>) => {
        state.loading = false;
        state.searchFilesResults = action.payload;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to search files";
      });
  },
});

export const selectFoldersAndFiles = (state: Rootstore) => state.files;

export default FilesSlice.reducer;