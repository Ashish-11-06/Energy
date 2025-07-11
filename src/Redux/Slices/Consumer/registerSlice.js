import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import registerApi from '../../api/consumer/registerApi';

// Async thunk to register a user
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi.registerUser(userData);
   // console.log('respones',response);
      
      if (response && response.data) {
        if(response.data.error){
          return rejectWithValue(
            response.data.error || 'Failed to register user'
          );
        }
     // console.log(response.data);
        
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

export const addSubUser = createAsyncThunk(
  'User/CreateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await registerApi.addSubUser(id, userData);
      
      if (response?.data) {
        if (response.data.error) {
          return rejectWithValue(response.data.error || 'Failed to register user');
        }
        return response.data; // Successfully registered user
      } else {
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      // Check if error has a response and status code
      if (error.response) {
        if (error.response.status === 400) {
          // Handle 400 Bad Request error
       // console.log('Bad Request:', error.response.data);
          return rejectWithValue(error.response.data || 'Bad Request: Please check the input data');
        }
        // Handle other types of error responses
        return rejectWithValue(error.response?.data?.error || 'Request failed');
      } else {
        // Handle case when error is not related to HTTP response
        return rejectWithValue('Failed to add user: Network error or server issue');
      }
    }
  }
);


// Async thunk to verify OTP
export const verifyOtp = createAsyncThunk(
  'register/verifyOtp',
  async (otp, { rejectWithValue }) => {
    try {
      const response = await registerApi.verifyOTP(otp);
      if (response && response.data) {
        if(response.data.error){
          return rejectWithValue(
            response.data.error || 'Failed to verify OTP'
          );
        }
        return response.data; // Successfully verified OTP
      } else {
        // If the response does not have data or is not structured correctly, reject with a message
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      // Handle errors if the request fails
      return rejectWithValue(
        error.response?.data?.message || 'Failed to verify OTP'
      );
    }
  }
);

// Initial state
const initialState = {
  user: null, // Holds the registered user
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if the API call fails
  otpStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  otpError: null, // Error message if the OTP verification failed
};

// Create the slice
const registerSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addSubUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addSubUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(addSubUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.otpStatus = 'loading';
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpStatus = 'succeeded';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpError = action.payload;
      });
  },
});

// Export the reducer to include it in the store
export default registerSlice.reducer;
