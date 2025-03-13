import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, logoutUser } from "../middlewares/authMiddleware";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  }
});

export const { logout, setUser, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
