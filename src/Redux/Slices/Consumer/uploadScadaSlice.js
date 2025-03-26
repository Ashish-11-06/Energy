import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import uploadScadaFileApi from '../../api/consumer/uploadScadaFileApi';

// Async thunk to upload a SCADA file
export const addScada = createAsyncThunk(
  'scadaFile/addScada',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await uploadScadaFileApi.addScada({ id, file });
      // console.log('response', response);

      if (response && response.data) {
        if (response.data.error) {
          return rejectWithValue(
            response.data.error || 'Failed to upload file'
          );
        }
        return response.data; // Successfully uploaded file
      } else {
        // If the response does not have data or is not structured correctly, reject with a message
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      // Handle errors if the request fails
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload file'
      );
    }
  }
);

// Initial state
const initialState = {
  scada: null, // Holds the uploaded file data
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const addScadaSlice = createSlice({
  name: 'scada',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addScada.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addScada.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scada = action.payload;
      })
      .addCase(addScada.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default addScadaSlice.reducer;
