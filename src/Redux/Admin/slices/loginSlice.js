import { createAsyncThunk } from '@reduxjs/toolkit';
import loginApi from '../api/loginApi';

// Async thunk for fetching annual saving data
export const loginSlice = createAsyncThunk(
  'user/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      console.log('data',data);
      
      const response = await loginApi.loginUser(data);
      console.log('res slice',response);
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Something went wrong');
    }
  }
);
