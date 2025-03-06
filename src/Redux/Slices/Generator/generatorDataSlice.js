import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addGeneratorData = createAsyncThunk(
  'generatorData/addGeneratorData',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/generator/data', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const generatorDataSlice = createSlice({
  name: 'generatorData',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addGeneratorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGeneratorData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addGeneratorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default generatorDataSlice.reducer;
