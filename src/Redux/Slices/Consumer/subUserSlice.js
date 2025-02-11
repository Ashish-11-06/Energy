
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import subUserApi from "../../api/consumer/subUserApi";
subUserApi
// Async thunk for fetching data
export const fetchSubUserById = createAsyncThunk(
  "subUser/subUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await subUserApi.subUser(userId);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for matching IPP
const subUserSlice = createSlice({
  name: "subUser",
  initialState: {
    subUser: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subUser = action.payload;
      })
      .addCase(fetchSubUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default subUserSlice.reducer;
