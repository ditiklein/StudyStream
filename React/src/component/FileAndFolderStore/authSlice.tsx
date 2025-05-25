import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rootstore } from "./FileStore";
import User from "../../Modles/User";
import api from "./Api";



interface AuthState {
  token: string | null;
  user: User ;
  loading: boolean;
  error: string | null;
}
const storedToken = sessionStorage.getItem('token');
const storedUser = sessionStorage.getItem('User');

let parsedUser: User | null = null;
if (storedUser && storedUser !== "undefined") {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (e) {
    console.error("שגיאה בניסיון לקרוא את storedUser:", e);
    parsedUser = null;
  }
}


const initialState: AuthState = {
  token: storedToken ? (storedToken) : null,
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

// Async Thunk for Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      console.log(credentials);
      console.log(api);
      
      const response = await api.post<{ token: string; user: User }>("/Auth/login", credentials);
      return response.data;
    } catch (error: any) {
      console.log(error.message);
      
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for Register
export const register = createAsyncThunk(
  'auth/register',
  async (newUser: {firstName:string,lastName:string,  email: string; password: string; }, thunkAPI) => {
    try {

      const response = await api.post('/Auth/register', {...newUser, roleName: 'User'});

      return response.data;
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
      state.token= storedToken ? JSON.parse(storedToken) : null,
      state.user= storedUser ? JSON.parse(storedUser) : null,
    
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      
        if (action.payload) {
          // אם השגיאה כוללת מידע
          const errorPayload = action.payload as any;  // אם השגיאה מכילה מידע, כמו תשובת ה־HTTP
          const status = errorPayload.response?.status;
          
          if (status === 401) {
            state.error = "משתמש לא קיים! בדוק את האימייל והסיסמה."; // טיפול בשגיאת 401
          } else {
            state.error = "שגיאה בהתחברות, אנא נסה שוב."; // טיפול בשגיאות אחרות
          }
        } else {
          state.error = "שגיאה כללית, נסה שוב מאוחר יותר."; // במקרה של שגיאה כלשהי ללא סטטוס ספציפי
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
