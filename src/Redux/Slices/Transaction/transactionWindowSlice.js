import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transactionWindowApi from "../../api/TransactionWindowApi";

// Async thunk for fetching data
export const fetchTransactions = createAsyncThunk(
  "liveTransactions/fetchByData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await transactionWindowApi.getAllTransactions(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for matching IPP
const transactionWindowSlice = createSlice({
  name: "liveTransactions",
  initialState: {
    liveTransactions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveTransactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default transactionWindowSlice.reducer;
