import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayAheadApi from "../api/consumer/dayAhead";

// Async thunk for fetching data
export const fetchDayAheadData = createAsyncThunk(
  "dayAheadData/fetchDayAheadData",
  async (_, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await dayAheadApi.getDayAhead();
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
const dayAheadSlice = createSlice({
  name: "tableData",
  initialState: {
    tableData: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDayAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDayAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableData = action.payload;
      })
      .addCase(fetchDayAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default dayAheadSlice.reducer;
