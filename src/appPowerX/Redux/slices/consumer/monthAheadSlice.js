import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthAheadApi from "../../api/consumer/monthAheadApi";

// Async thunk for fetching data
export const fetchMonthAheadData = createAsyncThunk(
  "monthAheadData/fetchMonthAheadData",
  async (_, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await monthAheadApi.getmonthAhead();
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
const monthAheadData = createSlice({
  name: "monthAheadData",
  initialState: {
    monthAheadData: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMonthAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthAheadData = action.payload;
      })
      .addCase(fetchMonthAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default monthAheadData.reducer;
