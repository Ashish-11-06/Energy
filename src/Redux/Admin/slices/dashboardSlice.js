import { createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../api/dashboardApi';

// Get dashboard list
export const getDashboardData = createAsyncThunk(
  'dashboard/getDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardData();
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
