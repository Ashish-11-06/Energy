import { createAsyncThunk } from '@reduxjs/toolkit';
import masterTableApi from '../api/masterTableApi';

// Get consumer list
export const getMasterTableData = createAsyncThunk(
  'consumer/getGeneratorList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await masterTableApi.getData();
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
export const editMasterTableDataById = createAsyncThunk(
  'generator/editGenerator',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await masterTableApi.editData({ data, id });
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error || 'Something went wrong');
    }
  }
);

// Delete consumer
export const deleteMasterTableDataByID = createAsyncThunk(
  'generator/deleteGenerator',
  async (id, { rejectWithValue }) => {
    try {
      const response = await masterTableApi.deleteData(id);
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
