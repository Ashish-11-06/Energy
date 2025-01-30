import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import termsAndConditionsApi from '../../api/generator/termsAndConditionsApi';

// Async thunk to add terms and conditions
export const addTermsAndConditions = createAsyncThunk(
  'termsAndConditions/fetchById',
  async (termsData, { rejectWithValue }) => {
    console.log(`klkkklklk`)
    try {
      console.log(`klkkklklk`, termsData)
      const response = await termsAndConditionsApi.addTermsAndConditions(termsData);
      console.log(`klkkklklk`, response)
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      console.log(`klkkklklk`, error)
      return rejectWithValue(
        error.response?.data?.error || 'Failed to add terms and conditions'
      );
    }
  }
);

export const updateTermsAndConditions = createAsyncThunk(
  'termsAndConditions/updateById',
  async ({ userId, termSheetId, termsData }, { rejectWithValue }) => {
    try {
      console.log('Updating terms and conditions:', termsData, userId, termSheetId);
      const response = await termsAndConditionsApi.updateTermsAndConditions(userId, termSheetId, termsData);
      
      console.log('API Response:', response);
      
      // Ensure response.data contains the correct data
      if (!response || !response.data) {
        throw new Error('No data received from the API');
      }

      return response.data; // Assuming the API returns data in response.data
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      
      // Improved error handling: You can log the error response if available
      return rejectWithValue(
        error?.response?.data?.error || error.message || 'Failed to update terms and conditions'
      );
    }
  }
);


export const addStatus = createAsyncThunk(
  'termsAndConditions/postStatus',
  async (termsData, { rejectWithValue }) => {
    console.log(`klkkklklk`)
    try {
      console.log(`klkkklklk`, termsData)
      const response = await termsAndConditionsApi.addStatus(termsData);
      console.log(`klkkklklk`, response)
      return response.data; // Assuming the API returns data in `response.data`
    } catch (error) {
      // Handle errors
      console.log(`klkkklklk`, error)
      return rejectWithValue(
        error.response?.data?.error || 'Failed to add terms and conditions'
      );
    }
  }
);

// Initial state
const initialState = {
  termsAndConditions: [], // Holds the fetched consumers
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const TermsAndConditionsSlice = createSlice({
  name: 'termsAndConditions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTermsAndConditions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTermsAndConditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.termsAndConditions = action.payload;
      })
      .addCase(addTermsAndConditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.termsAndConditions = action.payload;
      })
      .addCase(addStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateTermsAndConditions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTermsAndConditions.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateTermsAndConditions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default TermsAndConditionsSlice.reducer;
