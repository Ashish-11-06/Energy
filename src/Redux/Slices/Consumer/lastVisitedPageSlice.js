
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import lastVisitedAPI from "../../api/consumer/lastVisitedPage";

// Async thunk for fetching data
export const lastVisitedPage = createAsyncThunk(
  "lastVisitedPage/lastPage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lastVisitedAPI.lastVisitedPage(data);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error);
    }
  }
);

// Slice for matching IPP
const lastVisitedPageSlice = createSlice({
  name: "lastVisitedPage",
  initialState: {
    lastVisitedPage: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(lastVisitedPage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(lastVisitedPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastVisitedPage = action.payload;
      })
      .addCase(lastVisitedPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to send data";
      });
  },
});

export default lastVisitedPageSlice.reducer;
