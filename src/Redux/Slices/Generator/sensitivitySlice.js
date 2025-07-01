
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sensitivityAPI from "../../api/generator/sensitivityApi";

// Async thunk for fetching data
export const fetchSensitivity = createAsyncThunk(
  "sensitivity/fetchByData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sensitivityAPI.getsensitivity(data);
   // console.log(response);
      
      if (response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error);
    }
  }
);

// Slice for matching IPP
const sensitivitySlice = createSlice({
  name: "sensitivity",
  initialState: {
    sensitivity: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensitivity.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSensitivity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sensitivity = action.payload;
      })
      .addCase(fetchSensitivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default sensitivitySlice.reducer;
