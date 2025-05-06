import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import capacitySizingApi from '../../api/generator/capacitySizingApi';

// Async thunk to fetch matching consumers by ID
export const fetchCapacitySizing = createAsyncThunk(
  'capacitySizing/fetchById',
  async (modalData, { rejectWithValue }) => {
    try {
      const response = await capacitySizingApi.getCapacitySizing(modalData);
      if (response && response.data) {
        if (response.data.error) {
       
          return rejectWithValue(response.data.error || 'Failed to fetch combinations');
        }
        return response.data;
      } else {
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      // console.log('Error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch combinations');
    }
  }
);

// Async thunk to save capacity sizing data
export const saveCapacitySizingData = createAsyncThunk(
  'capacitySizing/saveData',
  async (data, { rejectWithValue }) => {
    try {

      // console.log('data in slice',data);
      
      const response = await capacitySizingApi.saveCapacitySizingData(data);
      // console.log('response in slice',response);
      
      if (response && response.data) {
        if (response.data.error) {
          return rejectWithValue(response.data.error || 'Failed to save data');
        }
        return response.data;
      } else {
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save data');
    }
  }
);

export const getCapacitySizingData = createAsyncThunk(
  'capacitySizing/getSavedData',
  async (id, { rejectWithValue }) => {
    try {
      const response = await capacitySizingApi.getCapacitySizingData(id);
      if (response && response.data) {
        if (response.data.error) {
          return rejectWithValue(response.data.error || 'Failed to fetch saved data');
        }
        return response.data;
      } else {
        return rejectWithValue('Unexpected response structure');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved data');
    }
  }
);

// Initial state
const initialState = {
  combinations: [],
  monthly_consumption: [],
  savedData: [],
  status: 'idle',
  fetchSavedStatus: 'idle',
  saveStatus: 'idle', // separate save status
  error: null,
  saveError: null,
};

// Slice definition
const capacitySizingSlice = createSlice({
  name: 'capacitySizing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --- Fetch Combinations ---
      .addCase(fetchCapacitySizing.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCapacitySizing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { combinations, monthly_consumption } = action.payload || {};
        state.combinations = combinations || [];
        state.monthly_consumption = monthly_consumption || [];
      })
      .addCase(fetchCapacitySizing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Save Data ---
      .addCase(saveCapacitySizingData.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(saveCapacitySizingData.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.savedData.push(action.payload); // Add saved record to state
      })
      .addCase(saveCapacitySizingData.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload;
      })

      // --- Fetch Saved Data ---
      .addCase(getCapacitySizingData.pending, (state) => {
        state.fetchSavedStatus = 'loading';
        state.fetchSavedError = null;
      })
      .addCase(getCapacitySizingData.fulfilled, (state, action) => {
        state.fetchSavedStatus = 'succeeded';
        state.savedData = action.payload || [];
      })
      .addCase(getCapacitySizingData.rejected, (state, action) => {
        state.fetchSavedStatus = 'failed';
        state.fetchSavedError = action.payload;
      });
      
  },
});

export default capacitySizingSlice.reducer;
