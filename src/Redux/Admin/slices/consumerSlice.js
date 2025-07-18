import { createAsyncThunk } from '@reduxjs/toolkit';
import consumerApi from '../api/consumerApi';

// Get consumer list
export const getConsumerList = createAsyncThunk(
  'consumer/getConsumerList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await consumerApi.getConsumerList();
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
export const editConsumer = createAsyncThunk(
  'consumer/editConsumer',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await consumerApi.editConsumer({ data, id });
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

// Delete consumer
export const deleteConsumer = createAsyncThunk(
  'consumer/deleteConsumer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await consumerApi.deleteConsumer(id);
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
