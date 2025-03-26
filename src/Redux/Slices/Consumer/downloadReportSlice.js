import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import downloadReportApi from "../../api/consumer/downloadReportApi";

// Async thunk for fetching data
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async ({ requirementId, userId }) => {
    try {
      const response = await downloadReportApi.report({ requirementId, userId }); // Pass object correctly
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  }
);

// Slice for managing report state
const reportSlice = createSlice({
  name: "report",
  initialState: {
    report: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.report = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default reportSlice.reducer;
