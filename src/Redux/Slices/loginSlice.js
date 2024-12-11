import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../api/auth';

// Async Thunks
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            console.log(response);
            const loginUserResponse = response.data;
// console.log(loginUserResponse);
            if (loginUserResponse.httpStatus === 'OK') {
                
                localStorage.setItem('user', JSON.stringify(loginUserResponse));
                
                return loginUserResponse;
            } else {
                return rejectWithValue(loginUserResponse.message);
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

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
