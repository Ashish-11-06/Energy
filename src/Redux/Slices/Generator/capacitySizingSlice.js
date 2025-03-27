import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import capacitySizingApi from '../../api/generator/capacitySizingApi';

// Async thunk to fetch matching consumers by ID
export const fetchCapacitySizing = createAsyncThunk(
  'capacitySizing/fetchById',
  async (modalData, { rejectWithValue }) => {
    try {
      // console.log('aabbcc');
      
      const response = await capacitySizingApi.getCapacitySizing(modalData);
      //  console.log(`klkkklklk`, response)
      if (response && response.data) {
        if(response.data.error){
          return rejectWithValue(
            response.data.error || 'Failed to fetch combinations'
          );
        }
        return response.data; // Successfully fetched data
      } else {
        // If the response does not have data or is not structured correctly, reject with a message
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      // Handle errors if the request fails
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch combinations'
      );
    }
  }
);


// Initial state
const initialState = {
  combinations: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const capacitySizingSlice = createSlice({
  name: 'optimizedCombinations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCapacitySizing.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCapacitySizing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.combinations = action.payload;
      })
      .addCase(fetchCapacitySizing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default capacitySizingSlice.reducer;
