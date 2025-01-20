import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';  // Assuming you have an API utility for user-related requests

// Async Thunks

// Register a new user
export const registerUser = createAsyncThunk( 'registerUser/registerUser', async (newUser, { rejectWithValue }) => {
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
            // Handle pending state
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.user = action.payload;  // Store the user data returned from the API
            })
            // Handle rejected state
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload || 'Registration failed';  // Store the error message
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