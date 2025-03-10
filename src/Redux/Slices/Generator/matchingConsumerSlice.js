import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import matchingConsumerApi from '../../api/generator/matchingConsumerApi';

// Async thunk to fetch matching consumers by ID
export const fetchMatchingConsumersById = createAsyncThunk(
  'matchingConsumer/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await matchingConsumerApi.getMatchingConsumersById(id);
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch matching consumers'
      );
    }
  }
);

// Initial state
const initialState = {
  Matchingconsumers: [], // Holds the fetched consumers
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
      .addCase(fetchMatchingConsumersById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMatchingConsumersById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Matchingconsumers = action.payload;
      })
      .addCase(fetchMatchingConsumersById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default matchingConsumerSlice.reducer;
