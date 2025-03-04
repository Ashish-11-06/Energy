import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthAheadApi from "../../api/consumer/monthAheadApi";

// Async thunk for fetching data
export const fetchMonthAheadData = createAsyncThunk(
  "monthAheadData/fetchMonthAheadData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthAheadApi.getmonthAhead();
      console.log('rrrrr',response);
      
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMonthAheadLineData = createAsyncThunk(
  "monthAheadData/fetchMonthAheadLineData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthAheadApi.getMonthAheadLineData();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTableMonthData = createAsyncThunk(
  "monthAheadData/fetchTableMonthData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthAheadApi.tableMonthData();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addTableMonthData = createAsyncThunk(
  "monthAheadData/addTableMonthData",
  async (newData, { rejectWithValue }) => {
    try {
      const response = await monthAheadApi.addTableMonthData(newData);
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for matching IPP
const monthAheadData = createSlice({
  name: "monthAheadData",
  initialState: {
    monthAheadData: [],
    monthAheadLineData: [],
    tableMonthData: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMonthAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthAheadData = action.payload;
      })
      .addCase(fetchMonthAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchMonthAheadLineData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMonthAheadLineData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthAheadLineData = action.payload;
      })
      .addCase(fetchMonthAheadLineData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchTableMonthData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTableMonthData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableMonthData = action.payload;
      })
      .addCase(fetchTableMonthData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(addTableMonthData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTableMonthData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableMonthData.push(action.payload);
        // Fetch the updated data
        fetchTableMonthData();
      })
      .addCase(addTableMonthData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default monthAheadData.reducer;
