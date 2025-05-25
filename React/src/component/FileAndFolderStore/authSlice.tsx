// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Rootstore } from "./FileStore";
// import User from "../../Modles/User";
// import api from "./Api";



// interface AuthState {
//   token: string | null;
//   user: User ;
//   loading: boolean;
//   error: string | null;
// }
// const storedToken = sessionStorage.getItem('token');
// const storedUser = sessionStorage.getItem('User');

// let parsedUser: User | null = null;
// if (storedUser && storedUser !== "undefined") {
//   try {
//     parsedUser = JSON.parse(storedUser);
//   } catch (e) {
//     console.error("שגיאה בניסיון לקרוא את storedUser:", e);
//     parsedUser = null;
//   }
// }
// console.log(parsedUser);



// const initialState: AuthState = {
//   token: storedToken ? (storedToken) : null,
//   user: storedUser ? JSON.parse(storedUser) : null,
//   loading: false,
//   error: null,
// };

// // Async Thunk for Login
// export const login = createAsyncThunk(
//   "auth/login",
//   async (credentials: { email: string; password: string }, thunkAPI) => {
//     try {
//       console.log(credentials);
//       console.log(api);
      
//       const response = await api.post<{ token: string; user: User }>("/Auth/login", credentials);
//       return response.data;
//     } catch (error: any) {
//       console.log(error.message);
      
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// // Async Thunk for Register
// export const register = createAsyncThunk(
//   'auth/register',
//   async (newUser: {firstName:string,lastName:string,  email: string; password: string; }, thunkAPI) => {
//     try {

//       const response = await api.post('/Auth/register', {...newUser, roleName: 'User'});

//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.token= storedToken ? JSON.parse(storedToken) : null,
//       state.user= storedUser ? JSON.parse(storedUser) : null,
    
//       state.error = null;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
      
//         if (action.payload) {
//           // אם השגיאה כוללת מידע
//           const errorPayload = action.payload as any;  // אם השגיאה מכילה מידע, כמו תשובת ה־HTTP
//           const status = errorPayload.response?.status;
          
//           if (status === 401) {
//             state.error = "משתמש לא קיים! בדוק את האימייל והסיסמה."; // טיפול בשגיאת 401
//           } else {
//             state.error = "שגיאה בהתחברות, אנא נסה שוב."; // טיפול בשגיאות אחרות
//           }
//         } else {
//           state.error = "שגיאה כללית, נסה שוב מאוחר יותר."; // במקרה של שגיאה כלשהי ללא סטטוס ספציפי
//         }
//       })
      
      
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string ,user:User}>) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string || "Registration failed";
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export const selectAuth = (state: Rootstore) => state.auth;
// export default authSlice.reducer;
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rootstore } from "./FileStore";
import User from "../../Modles/User";
import api from "./Api";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// פונקציה בטוחה לקריאת sessionStorage
const getStoredUser = (): User | null => {
  try {
    const storedUser = sessionStorage.getItem('User');
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }
    return JSON.parse(storedUser);
  } catch (e) {
    console.error("שגיאה בניסיון לקרוא את storedUser:", e);
    return null;
  }
};

const getStoredToken = (): string | null => {
  const storedToken = sessionStorage.getItem('token');
  if (!storedToken || storedToken === "undefined" || storedToken === "null" || storedToken === "") {
    return null;
  }
  return storedToken;
};

const initialState: AuthState = {
  token: getStoredToken(),
  user: getStoredUser(),
  loading: false,
  error: null,
};

// Async Thunk for Login

// החליפי את login thunk ב-authSlice.ts:

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      console.log('=== SENDING LOGIN REQUEST ===');
      console.log('Credentials:', credentials);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      const response = await api.post("/Auth/login", credentials);
      
      console.log('=== RAW SERVER RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // השרת מחזיר Token ו-User (עם אותיות גדולות)
      // אבל אנחנו צריכים token ו-user (עם אותיות קטנות)
      const serverData = response.data;
      const normalizedData = {
        token: serverData.Token,    // T גדולה מהשרת → t קטנה
        user: serverData.User       // U גדולה מהשרת → u קטנה
      };
      
      console.log('=== NORMALIZED DATA ===');
      console.log('Normalized data:', normalizedData);
      
      return normalizedData;
    } catch (error: any) {
      console.log('=== LOGIN ERROR ===');
      console.log('Error:', error);
      console.log('Error response:', error.response);
      
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// גם תתקני את register:
export const register = createAsyncThunk(
  'auth/register',
  async (newUser: {firstName:string,lastName:string,  email: string; password: string; }, thunkAPI) => {
    try {
      const response = await api.post('/Auth/register', {...newUser, roleName: 'User'});
      
      // השרת מחזיר Token ו-User (עם אותיות גדולות)
      const serverData = response.data;
      const normalizedData = {
        token: serverData.Token,    // T גדולה מהשרת → t קטנה
        user: serverData.User       // U גדולה מהשרת → u קטנה
      };
      
      return normalizedData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
      
      // ניקוי sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('User');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
  console.log('=== LOGIN FULFILLED ===');
  console.log('Action payload:', action.payload);
  console.log('Token:', action.payload.token);
  console.log('User:', action.payload.user);
  
  state.loading = false;
  state.token = action.payload.token;
  state.user = action.payload.user;
  
  // שמירה ב-sessionStorage
  console.log('Saving to sessionStorage...');
  sessionStorage.setItem('token', action.payload.token);
  sessionStorage.setItem('User', JSON.stringify(action.payload.user));
  
  console.log('Saved token:', sessionStorage.getItem('token'));
  console.log('Saved user:', sessionStorage.getItem('User'));
})
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      
        if (action.payload) {
          const errorPayload = action.payload as any;
          const status = errorPayload.response?.status;
          
          if (status === 401) {
            state.error = "משתמש לא קיים! בדוק את האימייל והסיסמה.";
          } else {
            state.error = "שגיאה בהתחברות, אנא נסה שוב.";
          }
        } else {
          state.error = "שגיאה כללית, נסה שוב מאוחר יותר.";
        }
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string ,user:User}>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        
        // שמירה ב-sessionStorage
        sessionStorage.setItem('token', action.payload.token);
        sessionStorage.setItem('User', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Registration failed";
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: Rootstore) => state.auth;
export default authSlice.reducer;