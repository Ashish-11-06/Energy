
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import termSheetApi from "../../api/TermSheetApi";

// Async thunk for fetching data
export const requestedIPPs = createAsyncThunk(
  "requestedIPPs/fetchById",
  async (user, { rejectWithValue }) => {
    try {
      const response = await termSheetApi.getTermSheet(user);
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
const requestedIPPsSlice = createSlice({
  name: "requestedIPPs",
  initialState: {
    requestedIPPs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestedIPPs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestedIPPs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requestedIPPs = action.payload;
      })
      .addCase(requestedIPPs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default requestedIPPsSlice.reducer;
