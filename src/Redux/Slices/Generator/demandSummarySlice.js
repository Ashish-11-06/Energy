import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import demandSummaryApi from '../../api/generator/demandSummaryApi';

// Async thunk to fetch matching consumers by ID
export const getDemandSummary = createAsyncThunk(
  'demandSummary/getDemandSummary',
  async (id, { rejectWithValue }) => {
    try {
      const response = await demandSummaryApi.getDemandSummary(id);
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch getDemandSummary'
      );
    }
  }
);

// Initial state
const initialState = {
   demadSummary:[],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const matchingConsumerSlice = createSlice({
  name: 'matchingConsumer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDemandSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getDemandSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Matchingconsumers = action.payload;
      })
      .addCase(getDemandSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default matchingConsumerSlice.reducer;
