import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';  // Assuming you have an API utility for user-related requests

// Async Thunks

// Register a new user
export const registerUser = createAsyncThunk('registerUser/registerUser', async (newUser, { rejectWithValue }) => {
        try {
            // Call your API for user registration
            const response = await userApi.RegisterUser(newUser); // Replace with your actual API call
            return response; // Return the response from the API (user data or token)
        } catch (error) {
            // Handle any error during the registration process
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
export const verifyUser = createAsyncThunk('registerUser/verifyUser', async (data, { rejectWithValue }) => {
        try {
            // Call your API for user registration
            const response = await userApi.verifyEmail(data); // Replace with your actual API call
            console.log(response);
            return response.data; // Return the response from the API (user data or token)
        } catch (error) {
            // Handle any error during the registration process
            console.log(error.response.data.error);
            return rejectWithValue(error.response.data.error ? error.response.data.error : 'Failed to verify Email');
        }
    }
);

// Register User Slice
const registerUserSlice = createSlice({
    name: 'registerUser',
    initialState: {
        user: null,          // Store user data after successful registration
        loading: false,      // Track if the registration is in progress
        error: null,         // Store any error messages
        status: 'idle',      // Track status of registration (idle, loading, succeeded, failed)
    },
    reducers: {
        clearError: (state) => {
            state.error = null;  // Action to clear any existing error
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle registerUser actions
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
    
            // Handle verifyUser actions
            .addCase(verifyUser.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.user = { ...state.user, isVerified: true }; // Mark user as verified
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload || 'Email verification failed';
            });
    },    
});

// Action exports
export const { clearError } = registerUserSlice.actions;

// Selectors
export const selectRegisterUserStatus = (state) => state.registerUser.status;
export const selectRegisterUserLoading = (state) => state.registerUser.loading;
export const selectRegisterUserError = (state) => state.registerUser.error;
export const selectRegisteredUser = (state) => state.registerUser.user;

// Export the reducer as default
export default registerUserSlice.reducer;