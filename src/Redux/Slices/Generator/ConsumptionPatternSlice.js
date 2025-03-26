import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import consumptionPatternApi from '../../api/generator/consumptionPatternApi';

// Async thunk to fetch matching consumers by ID
export const fetchConsumptionPattern = createAsyncThunk(
  'consumptionPatter/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await consumptionPatternApi.getConsumptionPattern(id);
      // console.log(response.data);
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch consumption patterns'
      );
    }
  }
);

// Initial state
const initialState = {
  patterns: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const consumptionPatternSlice = createSlice({
  name: 'consumptionPattern',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsumptionPattern.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConsumptionPattern.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patterns = action.payload.monthly_consumption;
      })
      .addCase(fetchConsumptionPattern.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default consumptionPatternSlice.reducer;
