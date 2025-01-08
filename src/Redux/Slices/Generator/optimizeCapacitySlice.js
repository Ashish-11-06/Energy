import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import optimizeCapacityApi from '../../api/generator/optimizeCapacityApi';

// Async thunk to fetch matching consumers by ID
export const fetchOptimizedCombinations = createAsyncThunk(
  'optimizedCapacity/fetchById',
  async (modalData, { rejectWithValue }) => {
    console.log(modalData);
    try {
      const response = await optimizeCapacityApi.getOptimizedCombination(modalData);
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch combinations'
      );
    }
  }
);

// Initial state
const initialState = {
  compinations: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const optimizeCapacitySlice = createSlice({
  name: 'optimizedCombinations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptimizedCombinations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOptimizedCombinations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Matchingconsumers = action.payload;
      })
      .addCase(fetchOptimizedCombinations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default optimizeCapacitySlice.reducer;
