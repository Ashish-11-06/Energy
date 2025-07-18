import { createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionApi from '../api/subscriptionApi';
subscriptionApi
// Get consumer list
export const offlineSubscription = createAsyncThunk(
  'subscription/offlineSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.offlineSubscription();
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

// Edit consumer
export const onlineSubscription = createAsyncThunk(
  'subscription/onlineSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.onlineSubscription();
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

