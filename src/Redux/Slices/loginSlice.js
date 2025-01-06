
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';

// Async Thunks
export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
    // console.log('Dispatching loginUser with credentials:', credentials);
    try {
        const response = await userApi.logInUser(credentials);
        // console.log('API response:', response);
        const loginUserResponse = response.data;
        localStorage.setItem('user', JSON.stringify(loginUserResponse));
        return loginUserResponse;
    } catch (error) {
        console.error('API error:', error.response.data);
        return rejectWithValue(error.response.data.error || 'Failed to login');
    }
});

export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    localStorage.removeItem('user');
    return {};
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('user'),
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
