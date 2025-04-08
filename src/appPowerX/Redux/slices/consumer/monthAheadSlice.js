import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthAheadApi from "../../api/consumer/monthAheadApi";

// Async thunk for fetching data
export const fetchMonthAheadData = createAsyncThunk(
  "monthAheadData/fetchMonthAheadData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthAheadApi.getmonthAhead();
      // console.log('rrrrr',response);
      
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadTableMonthDataC = createAsyncThunk(
  "monthAheadData/uploadTableMonthData",
  async (newData, { rejectWithValue }) => {
    try {
      console.log("Data in slice:", newData); // Log the data being sent
      
      const response = await monthAheadApi.uploadTableMonthData(newData);
      console.log("Response:", response); // Log the response status for debugging
      console.log("Response from addTableMonthData:", response.data); // Log the response for debugging
      
      if(response.data) {
        return response.data; // Assuming the API returns the created data
      }


      // if (response.status === 201 || response.status === 200 || response.data) {
      //   // Fetch the updated data
      //   const updatedResponse = await monthAheadApi.getUpdatedTableMonthData({id:newData.id});
      //   console.log("Updated response:", updatedResponse); // Log the updated response for debugging
        
      //   if (updatedResponse.status === 200 && updatedResponse.data) {
      //     return updatedResponse.data;
      //   }
      //   throw new Error("Failed to fetch updated data");
      // }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.log("Error in slice:", error); // Log the error for debugging
      console.log("Error response:", error.response); // Log the error response for debugging
      
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

export const addMonthData = createAsyncThunk(
  "monthAheadData/addMonthData",
  async (newData, { rejectWithValue }) => {
    // console.log('slice',newData);
    
    try {
      const response = await monthAheadApi.addMonthData(newData);
      if (response.status === 201 || response.status === 200) {
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
      // .addCase(fetchMonthAheadLineData.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(fetchMonthAheadLineData.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.monthAheadLineData = action.payload;
      // })
      // .addCase(fetchMonthAheadLineData.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload || "Failed to fetch data";
      // })
      // .addCase(fetchTableMonthData.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(fetchTableMonthData.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.tableMonthData = action.payload;
      // })
      // .addCase(fetchTableMonthData.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload || "Failed to fetch data";
      // })
      // .addCase(addTableMonthData.pending, (state) => {
      //   state.status = "loading";
      //   state.error = null;
      // })
      // .addCase(addTableMonthData.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.tableMonthData.push(action.payload);
      //   // Fetch the updated data
      //   fetchTableMonthData();
      // })
      // .addCase(addTableMonthData.rejected, (state, action) => {
      //   state.status = "failed";
      //   state.error = action.payload || "Failed to fetch data";
      // })
      .addCase(addMonthData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addMonthData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthAheadData.push(action.payload);
        // Fetch the updated data
        fetchTableMonthData();
      })
      .addCase(addMonthData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
       .addCase(uploadTableMonthDataC.pending, (state) => {
              state.status = "loading";
              state.error = null;
            })
            .addCase(uploadTableMonthDataC.fulfilled, (state, action) => {
              state.status = "succeeded";
              state.tableMonthData = action.payload;
            })
            .addCase(uploadTableMonthDataC.rejected, (state, action) => {
              state.status = "failed";
              state.error = action.payload || "Failed to fetch data";
            });
  },
});

export default monthAheadData.reducer;
