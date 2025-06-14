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
export const changeWindowDate = createAsyncThunk(
  "liveTransactions/changeWindowDate",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await transactionWindowApi.changeWindowDate(userId);
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
    windowDate: [],
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
      })
      .addCase(changeWindowDate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changeWindowDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.windowDate = action.payload;
      })
      .addCase(changeWindowDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default transactionWindowSlice.reducer;
