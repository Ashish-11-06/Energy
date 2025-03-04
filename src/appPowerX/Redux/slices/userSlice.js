import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../api/userApi";

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "userData/fetchUserData",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.login(userData);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for user data
const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    userData: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user data";
      });
  },
});

export default userDataSlice.reducer;
