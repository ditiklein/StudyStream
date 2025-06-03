import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "./Api";
import { Rootstore } from "./FileStore";
import { MessageDTO, MessagePostModel } from "../../Modles/Message";


interface MessageState {
  messages: MessageDTO[];
  userMessages: MessageDTO[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessageState = {
  messages: [],
  userMessages: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

// קבלת כל ההודעות
export const getAllMessages = createAsyncThunk(
  "messages/getAllMessages",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/Message");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בטעינת ההודעות");
    }
  }
);

// קבלת הודעות לפי משתמש
export const getMessagesByUserId = createAsyncThunk(
  "messages/getMessagesByUserId",
  async (userId: number, thunkAPI) => {
    try {
      const response = await api.get(`/Message/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בטעינת הודעות המשתמש");
    }
  }
);

// הוספת הודעה חדשה
export const addMessage = createAsyncThunk(
  "messages/addMessage",
  async (messageData: MessagePostModel, thunkAPI) => {
    try {
      const response = await api.post("/Message", messageData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בהוספת ההודעה");
    }
  }
);

// מחיקת הודעה
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (messageId: number, thunkAPI) => {
    try {
      await api.delete(`/Message/${messageId}`);
      return messageId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה במחיקת ההודעה");
    }
  }
);

// סימון הודעה כנקראה
export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (messageId: number, thunkAPI) => {
    try {
      await api.put(`/Message/markasread/${messageId}`);
      return messageId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בסימון ההודעה כנקראה");
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessageState: (state) => {
      state.messages = [];
      state.userMessages = [];
      state.unreadCount = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // קבלת כל ההודעות
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMessages.fulfilled, (state, action: PayloadAction<MessageDTO[]>) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // קבלת הודעות לפי משתמש
      .addCase(getMessagesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesByUserId.fulfilled, (state, action: PayloadAction<MessageDTO[]>) => {
        state.loading = false;
        state.userMessages = action.payload;
        state.unreadCount = action.payload.filter(msg => !msg.isRead).length;
      })
      .addCase(getMessagesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // הוספת הודעה
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action: PayloadAction<MessageDTO>) => {
        state.loading = false;
        state.messages.unshift(action.payload);
        if (state.userMessages.length > 0 && 
            state.userMessages[0].userId === action.payload.userId) {
          state.userMessages.unshift(action.payload);
          if (!action.payload.isRead) {
            state.unreadCount++;
          }
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // מחיקת הודעה
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        const messageId = action.payload;
        state.messages = state.messages.filter(msg => msg.id !== messageId);
        const deletedUserMessage = state.userMessages.find(msg => msg.id === messageId);
        state.userMessages = state.userMessages.filter(msg => msg.id !== messageId);
        if (deletedUserMessage && !deletedUserMessage.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // סימון כנקראה
      .addCase(markAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<number>) => {
        const messageId = action.payload;
        const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1 && !state.messages[messageIndex].isRead) {
          state.messages[messageIndex].isRead = true;
        }
        const userMessageIndex = state.userMessages.findIndex(msg => msg.id === messageId);
        if (userMessageIndex !== -1 && !state.userMessages[userMessageIndex].isRead) {
          state.userMessages[userMessageIndex].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearMessageState } = messageSlice.actions;

export const selectMessages = (state: Rootstore) => state.messages;

export default messageSlice.reducer;
