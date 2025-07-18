import { createAsyncThunk } from '@reduxjs/toolkit';
import generatorApi from '../api/generatorApi';

// Get consumer list
export const getGeneratorList = createAsyncThunk(
  'consumer/getGeneratorList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await generatorApi.getGeneratorList();
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
export const editGenerator = createAsyncThunk(
  'generator/editGenerator',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await generatorApi.editGenerator({ data, id });
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
export const deleteGenerator = createAsyncThunk(
  'generator/deleteGenerator',
  async (id, { rejectWithValue }) => {
    try {
      const response = await generatorApi.deleteGenerator(id);
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
