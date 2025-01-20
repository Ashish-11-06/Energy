import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import monthlyConsumptionBillApi from '../../api/consumer/monthlyConsumptionBillApi';

// Async thunk to register a user
export const consumptionBill = createAsyncThunk(
  'consumption/consumptionBill',
  async ({ requirement, month, bill_file }, { rejectWithValue }) => {
    try {
      const response = await monthlyConsumptionBillApi.consumptionBill({
        requirement,
        month,
        bill_file,
      });
      console.log('response', response);
      
      if (response && response.data) {
        if(response.data.error){
          return rejectWithValue(
            response.data.error || 'Failed to upload file'
          );
        }
        return response.data; // Successfully registered user
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
  bill: null, // Holds the registered user
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
  otpStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  otpError: null, // Error message if the OTP verification fails
};

// Create the slice
const registerSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(consumptionBill.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(consumptionBill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bill = action.payload;
      })
      .addCase(consumptionBill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default registerSlice.reducer;
