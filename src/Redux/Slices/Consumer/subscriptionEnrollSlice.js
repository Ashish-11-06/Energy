import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionEnrollApi from '../../api/consumer/subscriptionEnrollApi';


export const subscriptionEnroll = createAsyncThunk(
    'subscription/subscriptionEnroll',
    async (subscriptionData, { rejectWithValue }) => {
      try {
        const response = await subscriptionEnrollApi.subscriptionEnroll(subscriptionData);
        // console.log('respones',response);
        
        if (response && response.data) {
          if(response.data.error){
            return rejectWithValue(
              response.data.error || 'Failed to register user'
            );
          }
          return response.data; // Successfully registered user
        } else {
          // If the response does not have data or is not structured correctly, reject with a message
          return rejectWithValue('Unexpected response structure');
        }
      } catch (error) {
        // console.log('error',error);
        // Handle errors if the request fails
        return rejectWithValue(
          error.response?.data?.error || 'Failed to register user'
        );
      }
    }
  );
// Async thunk to fetch subscription validity (GET request)
export const fetchSubscriptionValidity = createAsyncThunk(
  'subscriptionPlan/fetchSubscriptionValidity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionEnrollApi.subscriptionValidity(id); // Assuming GET request
      if (response && response.data) {
          // console.log(response.data);
        return response.data; // Successfully fetched subscription validity data
        
      } else {
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching subscription validity:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subscription validity');
    }
  }
);

// Initial state
const initialState = {
  subscription: [], // Holds the registered user
  subscriptionValidity: [], // Holds the subscription validity data
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
};

// Create the slice
const subscriptionEnrollSlice = createSlice({
  name: 'subscriptionData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscriptionEnroll.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(subscriptionEnroll.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscription = action.payload;
      })
      .addCase(subscriptionEnroll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handling the subscription validity fetch cases
      .addCase(fetchSubscriptionValidity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubscriptionValidity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subscriptionValidity = action.payload;
      })
      .addCase(fetchSubscriptionValidity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default subscriptionEnrollSlice.reducer;
