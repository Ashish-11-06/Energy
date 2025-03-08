import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayAheadApi from "../../api/generator/dayAheadG";

// Async thunk for fetching data
export const fetchDayAheadData = createAsyncThunk(
  "dayAheadData/fetchDayAheadData",
  async (dayAheaGeneration, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    console.log('ddd',dayAheadGeneration);
    
    try {
      const response = await dayAheadApi.getDayAhead(dayAheadGeneration);
      if (response.status === 201 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const addDayAheadData = createAsyncThunk(
  "dayAheadData/addDayAheadData",
  async (dayAheadGeneration, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await dayAheadApi.addDayAheadData(dayAheadGeneration);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      // throw new Error("Invalid response from server");
    } catch (error) {
      console.log('err',error.message);
      
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const dayAheadData = createAsyncThunk(
  "dayAheadData/dayAheadData",
  async (_, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await dayAheadApi.dayAheadData();
      console.log('res',response);
      
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const fetchMCVData = createAsyncThunk(
  "mcvData/fetchMCVData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dayAheadApi.mcvData(); // No need to check response.status
      return data; // Just return the data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchMCPData = createAsyncThunk(
  "mcpData/fetchMCPData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dayAheadApi.mcpData(); // No need to check response.status
      return data; // Just return the data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




// Slice for matching IPP
const dayAheadSlice = createSlice({
  name: "tableData",
  initialState: {
    tableData: [],
    mcvData:[],
    mcpData:[],
    dayAheadData:[],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDayAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDayAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tableData = action.payload;
      })
      .addCase(fetchDayAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(dayAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(dayAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dayAheadData = action.payload;
      })
      .addCase(dayAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchMCVData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMCVData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mcvData = action.payload;
      })
      .addCase(fetchMCVData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchMCPData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMCPData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mcpData = action.payload;
      })
      .addCase(fetchMCPData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(addDayAheadData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addDayAheadData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dayAheadData = action.payload;
      })
      .addCase(addDayAheadData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default dayAheadSlice.reducer;
