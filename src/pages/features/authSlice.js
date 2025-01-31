import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//LO$: Redux + axios
//Login Component: Dispatches the loginUser action and reads authentication state (isLoading, error).
//Global Store: Configures Redux to manage authentication state across the app.

// Async thunk for login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData) => {
  const response = await axios.post("http://localhost:3000/auth/login", userData);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        state.user = action.meta.arg;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
