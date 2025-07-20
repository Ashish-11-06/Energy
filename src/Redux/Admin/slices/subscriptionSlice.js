import { createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionApi from '../api/subscriptionApi';
subscriptionApi

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

export const getSubscriptionPlan = createAsyncThunk(
  'subscription/getSubscriptionPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getSubscriptionPlan();
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

export const editSubscriptionPlan = createAsyncThunk(
  'subscription/editSubscriptionPlan',
  async ({id,data}, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.editPlan({id,data});
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

export const deleteSubscriptionPlan = createAsyncThunk(
  'subscription/deleteSubscriptionPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.deletePlan();
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

