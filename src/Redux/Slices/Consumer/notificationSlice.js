/* eslint-disable no-unused-vars */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import notificationApi from "../../api/consumer/notificationApi";

// Async thunk for fetching data
export const fetchNotificationById = createAsyncThunk(
  "notification/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await notificationApi.notification(userId);
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
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default notificationSlice.reducer;
