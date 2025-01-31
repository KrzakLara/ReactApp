import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./pages/features/authSlice"; // Ensure this path is correct

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});
