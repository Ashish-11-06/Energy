import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import templateDownloadApi from "../../api/generator/templateDownloadApi";

export const templateDownload = createAsyncThunk(
  "template/fetchById",
  async (templateData, { rejectWithValue }) => {
    try {
      // console.log("Request Sent:", templateData);
      const response = await templateDownloadApi.templateDownload(templateData);
      // console.log("API Response:", response);

      if (response?.data) {
        if (response.data.error) {
          return rejectWithValue(response.data.error || "Failed to fetch template");
        }
        return response.data;
      } else {
        return rejectWithValue("Unexpected response structure");
      }

    } catch (error) {
   // console.log("Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch template");
    }
  }
);

const initialState = {
  template: [],
  status: "idle",
  error: null,
};

const templateDownloadSlice = createSlice({
  name: "templateDownload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(templateDownload.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(templateDownload.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.template = action.payload;
      })
      .addCase(templateDownload.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default templateDownloadSlice.reducer;
