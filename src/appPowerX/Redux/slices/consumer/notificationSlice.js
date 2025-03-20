import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationApi from "../../api/consumer/notificationApi";

// Async thunk for updating notification
export const getNotificationData = createAsyncThunk(
  "notificationData/getNotificationData",
  async (userId, { rejectWithValue }) => { // Accept message as parameter
    // console.log('user',userId);
    try {
        // console.log("User ID:", userId, typeof userId);
        const response = await notificationApi.getNotification(Number(userId)); 

      if (response.status === 200 && response.data) {
        // console.log("Updated notification:", response.data);
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateNotificationData = createAsyncThunk(
  "notificationData/updateNotificationData",
  async (message, { rejectWithValue }) => { // Accept message as parameter
    try {
      const response = await notificationApi.updateNotification({ message }); // Ensure PATCH request

      if (response.status === 200 && response.data) {
        // console.log("Updated notification:", response.data);
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Notification slice
const notificationData = createSlice({
  name: "notificationData",
  initialState: {
    notificationData: null, // Notification is a single object, not an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateNotificationData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateNotificationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notificationData = action.payload; // Store updated notification
      })
      .addCase(updateNotificationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update notification";
      })
      .addCase(getNotificationData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getNotificationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notificationData = action.payload; // Store updated notification
      })
      .addCase(getNotificationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update notification";
      });
  },
});

export default notificationData.reducer;
