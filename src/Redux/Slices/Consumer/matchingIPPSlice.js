
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import matchingIPPApi from "../../api/consumer/matchingIPPApi";

// Async thunk for fetching data
export const fetchMatchingIPPById = createAsyncThunk(
  "matchingIPP/fetchById",
  async (requirementId, { rejectWithValue }) => {
    try {
      const response = await matchingIPPApi.matchingIpp(requirementId);
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
const matchingIPPSlice = createSlice({
  name: "matchingIPP",
  initialState: {
    matchingIPP: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchingIPPById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatchingIPPById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matchingIPP = action.payload;
      })
      .addCase(fetchMatchingIPPById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default matchingIPPSlice.reducer;
