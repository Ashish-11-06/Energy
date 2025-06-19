import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import uploadCSVFileApi from '../../api/consumer/uploadCSVFileApi';

// Add consumption action
export const uploadCSV = createAsyncThunk(
  'uploadCSVFile/uploadCSV',
  async ({ requirement_id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('requirement_id', requirement_id);
      formData.append('csv_file', file);
      // Make API call to add a new requirement
      const response = await uploadCSVFileApi.addCSV(formData);
      return response.data;
    } catch (error) {
      // console.error('Error uploading CSV file:', error);
      // Handle errors
      return rejectWithValue(error.response?.data?.error || 'Failed to add csv file');
    }
  }
);

const initialState = {
  loading: false,    // Loading state to track API requests
  error: null,       // To track any errors during API calls
  csv: [],           // Stores the monthly consumption data
};

const uploadCSVFileSlice = createSlice({
  name: 'uploadCSVFile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling Add Consumption
      .addCase(uploadCSV.pending, (state) => {
        state.loading = true;   // Set loading to true while adding
        state.error = null;     // Reset error state
      })
      .addCase(uploadCSV.fulfilled, (state, action) => {
        state.loading = false;  // Set loading to false after adding successfully
        state.csv = action.payload; // Add new data to
        // console.log(action.payload);
      })
      .addCase(uploadCSV.rejected, (state, action) => {
        state.loading = false;  // Set loading to false after failed add
        state.error = action.payload; // Store error message
      });
  },
});

export default uploadCSVFileSlice.reducer;
