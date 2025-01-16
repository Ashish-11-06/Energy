import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import monthlyConsumptionApi from '../../api/consumer/monthlyConsumptionApi';

// Add consumption action
export const addConsumption = createAsyncThunk(
  'monthlyConsumption/addConsumption',
  async (monthlyData, { rejectWithValue }) => {
    try {
      console.log(monthlyData);
      // Make API call to add a new requirement
      const response = await monthlyConsumptionApi.monthlyconsumptionData(monthlyData);
      return response.data;
    } catch (error) {
      // Handle errors
      return rejectWithValue(error.response?.data?.error || 'Failed to add monthly consumption data');
    }
  }
);

// Fetch monthly consumption data action
export const fetchMonthlyDataById = createAsyncThunk(
  'monthlyConsumption/fetchMonthlyDataById',
  async (id, { rejectWithValue }) => {
    try {
      // Make API call to fetch monthly consumption data
      const response = await monthlyConsumptionApi.getMonthlyConsumption(id);
      console.log('monthly data in slice ',response.data);
      
      return response.data;

    } catch (error) {
      // Handle errors
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch monthly consumption data');
    }
  }
);

const initialState = {
  loading: false,    // Loading state to track API requests
  error: null,       // To track any errors during API calls
  monthlyData: [],   // Stores the monthly consumption data
};

const monthlyConsumptionSlice = createSlice({
  name: 'monthlyConsumption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling Add Consumption
      .addCase(addConsumption.pending, (state) => {
        state.loading = true;   // Set loading to true while adding
        state.error = null;     // Reset error state
      })
      .addCase(addConsumption.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false after adding successfully
        state.monthlyData = action.payload; // Add new data to
        console.log(action.payload);
      })
      .addCase(addConsumption.rejected, (state, action) => {
        state.loading = false;  // Set loading to false after failed add
        state.error = action.payload; // Store error message
      })
      
      // Handling Fetch Monthly Data
      .addCase(fetchMonthlyDataById.pending, (state) => {
        state.loading = true;   // Set loading to true while fetching
        state.error = null;     // Reset error state
      })
      .addCase(fetchMonthlyDataById.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false after fetching successfully
        state.monthlyData = action.payload; // Update monthly data with fetched data
        console.log(action.payload);
      })
      .addCase(fetchMonthlyDataById.rejected, (state, action) => {
        state.loading = false;  // Set loading to false after failed fetch
        state.error = action.payload; // Store error message
      });
  },
});

export default monthlyConsumptionSlice.reducer;
