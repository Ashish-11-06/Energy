
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../api/userApi';


export const sendForgotPasswordOtp = createAsyncThunk(
    "users/sendForgotPasswordOtp",
    async (email, { rejectWithValue }) => {
      try {
        await userApi.sendForgotPasswordOtp(email);
        return { email };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to send OTP.");
      }
    }
  );
  
  // ✅ Verify OTP
  export const verifyForgotPasswordOtp = createAsyncThunk(
    "users/verifyForgotPasswordOtp",
    async ({ email, otp }, { rejectWithValue }) => {
      try {
        await userApi.verifyForgotPasswordOtp({ email, otp });
        return { email, otpVerified: true };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Invalid OTP.");
      }
    }
  );
  
  // ✅ Reset Password
  export const setNewPassword = createAsyncThunk(
    "users/setNewPassword",
    async ({ email, newPassword }, { rejectWithValue }) => {
      try {
        await userApi.setNewPassword({ email, newPassword });
        return { success: true };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to reset password.");
      }
    }
  );

// Async Thunks
export const loginUser = createAsyncThunk('users/loginUser', async (credentials, { rejectWithValue }) => {
    console.log('Dispatching loginUser with credentials:', credentials);
    try {
        localStorage.clear();
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
    localStorage.clear();
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
        forgotPasswordEmail: null,
        otpVerified: false,
        passwordResetSuccess: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetForgotPasswordState: (state) => {
          state.forgotPasswordEmail = null;
          state.otpVerified = false;
          state.passwordResetSuccess = false;
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
            })
            .addCase(sendForgotPasswordOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
                state.forgotPasswordEmail = action.payload.email;
                state.loading = false;
              })
              .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
        
              // ✅ Verify OTP Cases
              .addCase(verifyForgotPasswordOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(verifyForgotPasswordOtp.fulfilled, (state) => {
                state.otpVerified = true;
                state.loading = false;
              })
              .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
        
              // ✅ Reset Password Cases
              .addCase(setNewPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(setNewPassword.fulfilled, (state) => {
                state.passwordResetSuccess = true;
                state.loading = false;
              })
              .addCase(setNewPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              });
    },
});

export const { clearError, resetForgotPasswordState } = userSlice.actions;

export default userSlice.reducer;
