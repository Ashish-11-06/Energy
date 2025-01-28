import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import templateDownloadApi from '../../api/generator/templateDownloadApi';

// Async thunk to fetch matching consumers by ID
export const templateDownload = createAsyncThunk(
  'template/fetchById',
  async (templateData, { rejectWithValue }) => {
    try {
      console.log('aabbcc');
      
      const response = await templateDownloadApi.templateDownload(templateData);
       console.log(`klkkklklk`, response)
      if (response && response.data) {
        if(response.data.error){
          return rejectWithValue(
            response.data.error || 'Failed to fetch template'
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
  template: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const templateDownloadSlice = createSlice({
  name: 'templateDownload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(templateDownload.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(templateDownload.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.template = action.payload;
      })
      .addCase(templateDownload.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default templateDownloadSlice.reducer;
