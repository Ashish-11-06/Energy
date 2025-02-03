
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import performaInvoiceApi from "../../api/consumer/performaInvoiceApi";

// Async thunk for fetching data
export const fetchPerformaById = createAsyncThunk(
  "performa/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await performaInvoiceApi.performa(userId);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const createPerformaById = createAsyncThunk(
  "performa/createPerforma",
  async ({ id, performaData }, { rejectWithValue }) => { 
    try {
      const response = await performaInvoiceApi.createPerforma(id, performaData);
      // console.log("API Response:", response); 
      // if (response.status === 201 && response.data) { 
      //   return response.data.data;
      // }
      // throw new Error("Failed to create performa invoice");
      return response.data.data;
    } catch (error) {
     console.error("API Error:", error.response?.data || error.message); 
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Slice for matching IPP
const performaSlice = createSlice({
  name: "performa",
  initialState: {
    performa: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformaById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPerformaById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.performa = action.payload;
      })
      .addCase(fetchPerformaById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })

      .addCase(createPerformaById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPerformaById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.performa.push(action.payload); // Add the new performa
      })
      .addCase(createPerformaById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create performa invoice";
      });
  },
});

export default performaSlice.reducer;


















// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import performaInvoiceApi from "../../api/consumer/performaInvoiceApi";

// // Async thunk for fetching data
// export const fetchPerformaById = createAsyncThunk(
//   "performa/fetchById",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await performaInvoiceApi.performa(userId);
//       if (response.status === 200 && response.data) {
//         return response.data; // Ensure response contains valid data
//       }
//       throw new Error("Invalid response from server");
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Slice for matching IPP
// const performaSlice = createSlice({
//   name: "performa",
//   initialState: {
//     performa: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPerformaById.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchPerformaById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.performa = action.payload;
//       })
//       .addCase(fetchPerformaById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to fetch data";
//       });
//   },
// });

// export default performaSlice.reducer;
