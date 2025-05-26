// import { 
//    createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import  { AxiosError } from "axios";
// import { Rootstore } from "./FileStore";
// import api from "./Api";

// // 🔹 שליפת תיקיות ראשיות (תיקיות ללא תיקיית אב)
// const fetchData = async (urls: string[]) => {
// console.log(urls);

//   const results = await Promise.allSettled(urls.map(url => api.get(url)));
//   return results.map(result => result.status === "fulfilled" ? result.value.data : []);
// };


// // בreducer

// export const fetchUserFolders = createAsyncThunk(
//   "folders/fetchUserFolders",
//   async (ownerId: number, thunkAPI) => {
//     try {
//       const response = await api.get(`/Folder/folders/${ownerId}`);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );

// export const fetchUserFiles = createAsyncThunk(
//   "files/fetchUserFiles",
//   async (ownerId: number, thunkAPI) => {
//     try {
//       const response = await api.get(`/Lesson/lessons/user/${ownerId}`);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );



// export const fetchRootFolders = createAsyncThunk(
//   "folders/fetchRoot",
//   async (ownerId: number, thunkAPI) => {
//     try {
//       const [folders, files] = await fetchData([
//         `/Folder/root/${ownerId}`,
//         `/Lesson/root/${ownerId}`
//       ]);
//       return { folders, files };
//     } catch (error) {
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );

// export const fetchSubFoldersAndFiles = createAsyncThunk(
//   "folders/fetchSubFoldersAndFiles",
//   async (
//     { parentFolderId, ownerId }: { parentFolderId: number; ownerId: number },
//     thunkAPI
//   ) => {
//     try {
//       const [folders, files] = await fetchData([
//         `/Folder/subfolders/${parentFolderId}/user/${ownerId}`,
//         `/Lesson/lessons/${parentFolderId}`
//       ]);
//       return { folders, files };
//     } catch (error) {
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );

// // 🔹 הוספת תיקייה חדשה
// export const addFolder = createAsyncThunk(
//   "folders/addFolder",
//   async ({ name, ownerId, parentFolderId }: { name: string; ownerId: number; parentFolderId: number | null }, thunkAPI) => {
//     try {
//       const response = await api.post("/Folder", {
//         name,
//         ownerId,
//         parentFolderId: parentFolderId ?? null, // אם אין הורה, שולחים null
//       });

//       return response.data; // מחזירים את התיקייה החדשה שנוצרה
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 🔹 הוספת קובץ
// export const addFile = createAsyncThunk(
//   "folders/addFile",
//   async ({ lessonName,description, ownerId, fileType, folderId }: { lessonName: string;description:string; ownerId: number; fileType: string; folderId: number | null }, thunkAPI) => {
//     try {
//       const response = await api.post("/Lesson", {
//         lessonName,
//         description,
//         ownerId,
//         fileType,
//         folderId: folderId ?? null, // אם אין הורה, שולחים null
//       });
//       return response.data; // מחזירים את הקובץ החדש שנוצר
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 🔹 עדכון תיקייה
// export const updateFolder = createAsyncThunk(
//   "folders/updateFolder",
//   async (
//     { id, name, ownerId ,parentFolderId}: { id: number; name: string; ownerId: number ,parentFolderId: number|null},
//     thunkAPI
//   ) => {
//     try {
//       console.log(id, name, ownerId ,parentFolderId);
      
//       const response = await api.put(
//         `/Folder/${id}`,
//         {
//           name,
//           ownerId,
//           parentFolderId
//         }
//       );
//       console.log(response);
      
//       return response.data; // מחזירים את התיקייה לאחר העדכון
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 🔹 מחיקת תיקייה
// export const deleteFolder = createAsyncThunk(
//   "folders/deleteFolder",
//   async (id: number, thunkAPI) => {
//     try {
//       await api.delete(`/Folder/${id}`);
//       return { id }; // מחזירים את ה-ID של התיקייה שנמחקה
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 🔹 עדכון קובץ
// export const updateFile = createAsyncThunk(
//   "files/updateFile",
//   async ({ id, lessonName, ownerId,folderId, fileType, url,isDeleted }: { id: number; lessonName: string; ownerId: number;folderId:number|null; fileType: string; url: string,isDeleted:boolean }, thunkAPI) => {
//     try {
//       const response = await api.put(
//         `/Lesson/${id}`,
//         {
//           lessonName,
//           ownerId,
//           folderId,
//           fileType,
//           url,
//           isDeleted
//         }
//       );
//       return response.data; // מחזירים את הקובץ לאחר העדכון
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // 🔹 מחיקת קובץ
// export const deleteFile = createAsyncThunk(
//   "files/deleteFile",
//   async (id: number, thunkAPI) => {
//     try {
//   await api.delete(`/Lesson/${id}`);
//       return { id }; // מחזירים את ה-ID של הקובץ שנמחק
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
// export const hardDeleteFile = createAsyncThunk(
//   "files/hardDeleteFile",
//   async (id: number, thunkAPI) => {
//     try {
//       await api.delete(`Lesson/harddelete/${id}`); // קריאה ל-API שמבצע מחיקה קשה
//       return { id }; // מחזירים את ה-ID של הקובץ שנמחק
//     } catch (error) {
//       const err = error as AxiosError;
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );


// export const searchFolders = createAsyncThunk(
//   "folders/searchFolders",
//   async (
//     { userId, currentFolderId, query }: { userId: number; currentFolderId: number|null; query: string },
//     thunkAPI
//   ) => {
//     try {
//       // בדיקה אם currentFolderId הוא null ובניית ה-URL בהתאם
//       const url = currentFolderId === null 
//         ? `/Folder/search-folders/?userId=${userId}&query=${query}` 
//         : `/Folder/search-folders/?userId=${userId}&folderId=${currentFolderId}&query=${query}`;
      
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.log("error folder");
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );

// export const searchFiles = createAsyncThunk(
//   "files/searchFiles",
//   async (
//     { userId, currentFolderId, query }: { userId: number; currentFolderId: number|null; query: string },
//     thunkAPI
//   ) => {
//     try {
//       // בדיקה אם currentFolderId הוא null ובניית ה-URL בהתאם
//       const url = currentFolderId === null 
//         ? `/Lesson/search-files/?userId=${userId}&query=${query}` 
//         : `/Lesson/search-files/?userId=${userId}&folderId=${currentFolderId}&query=${query}`;
      
//       const response = await api.get(url);
//       return response.data;
//     } catch (error) {
//       console.log("errrrrr");
//       return thunkAPI.rejectWithValue((error as AxiosError).response?.data || error);
//     }
//   }
// );

// const FilesSlice = createSlice({
//   name: "files",
//   initialState: {
//     folders: [] as any[], // רשימת תיקיות
//     files: [] as any[], 
//     allUserFolders: [] as any[],
//     allUserFiles: [] as any[],
//     searchFoldersResults: [] as any[], // תוצאות חיפוש תיקיות
//     searchFilesResults: [] as any[], // תוצאות חיפוש קבצים

//     loading: false, // מצב טעינה
//     error: null as string | null, // הודעת שגיאה במידה ויש
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // 🔄 סטטוס טעינה עבור חיפוש תיקיות
//       .addCase(fetchRootFolders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
      
//       .addCase(fetchRootFolders.fulfilled, (state, action: PayloadAction<{ folders: any[]; files: any[] }>) => {
//         state.loading = false;
//         state.folders = action.payload.folders;
//         state.files = action.payload.files;
        
//       })
//       .addCase(fetchRootFolders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch root folders";
//       })

//       // 🔄 סטטוס טעינה עבור חיפוש קבצים
//       .addCase(fetchSubFoldersAndFiles.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSubFoldersAndFiles.fulfilled, (state, action: PayloadAction<{ folders: any[]; files: any[] }>) => {
//         state.loading = false;
//         state.folders = action.payload.folders;
//         state.files = action.payload.files;
//       })
//       .addCase(fetchSubFoldersAndFiles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch subfolders and files";
//       })

//       // ➕ הוספת תיקייה
//       .addCase(addFolder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addFolder.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.folders.push(action.payload); // מוסיפים את התיקייה החדשה לסטור
//       })
//       .addCase(addFolder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to add folder";
//       })

//       // ➕ הוספת קובץ
//       .addCase(addFile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addFile.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.files.push(action.payload); // מוסיפים את הקובץ החדש לרשימה
//       })
//       .addCase(addFile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to add file";
//       })

//       // 🔄 סטטוס טעינה עבור עדכון תיקייה
//       .addCase(updateFolder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateFolder.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         const updatedFolder = action.payload;
//         const index = state.folders.findIndex((folder) => folder.id === updatedFolder.id);
//         if (index !== -1) {
//           state.folders[index] = updatedFolder;
//         }
//       })
      
      

      
//       .addCase(updateFolder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to update folder";
//       })

//       // 🔄 סטטוס טעינה עבור מחיקת תיקייה
//       .addCase(deleteFolder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteFolder.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
//         state.loading = false;
//         state.folders = state.folders.filter((folder) => folder.id !== action.payload.id);
//       })
//       .addCase(deleteFolder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to delete folder";
//       })

//       // 🔄 סטטוס טעינה עבור מחיקת קובץ
//       .addCase(deleteFile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteFile.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
//         state.loading = false;
//         state.files = state.files.filter((file) => file.id !== action.payload.id);
//       })
//       .addCase(deleteFile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to delete file";
//       })

//       // 🔄 סטטוס טעינה עבור עדכון קובץ
//       .addCase(updateFile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateFile.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         console.log("ssssss");
//                 const updatedFile = action.payload;
//         const index = state.files.findIndex((file) => file.id === updatedFile.id);
//         if (index !== -1) {
//           state.files[index] = updatedFile;
//         }
//       })
      
//             .addCase(updateFile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to update file";
//       })
//       .addCase(fetchUserFolders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserFolders.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.allUserFolders = action.payload;
//       })
//       .addCase(fetchUserFolders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user folders";
//       })
//       .addCase(fetchUserFiles.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserFiles.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.allUserFiles = action.payload;
//       })
//       .addCase(fetchUserFiles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch user files";
//       })
//       .addCase(hardDeleteFile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(hardDeleteFile.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
//         state.loading = false;
//         state.files = state.files.filter((file) => file.id !== action.payload.id); // מסננים את הקובץ שנמחק
//       })
//       .addCase(hardDeleteFile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to hard delete file";
//       })
//       .addCase(searchFolders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchFolders.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.searchFoldersResults = action.payload; // עדכון תוצאות החיפוש
//       })
//       .addCase(searchFolders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to search folders";
//       })

//       // 🔄 סטטוס טעינה עבור חיפוש קבצים
//       .addCase(searchFiles.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchFiles.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.searchFilesResults = action.payload; // עדכון תוצאות החיפוש
//       })
//       .addCase(searchFiles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = typeof action.payload === "string" ? action.payload : "Failed to search files";
//       })

      

//   },
// });

// export const selectFoldersAndFiles = (state: Rootstore) => state.files;

// export default FilesSlice.reducer;





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