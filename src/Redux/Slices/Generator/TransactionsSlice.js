import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import transactionWindowApi from '../../api/generator/transactionWindowApi';

// Async thunk to add terms and conditions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await transactionWindowApi.getTransactions(userId);
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data?.error || 'Failed to add terms and conditions'
      );
    }
  }
);

// Initial state
const initialState = {
  transactions: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default transactionsSlice.reducer;
