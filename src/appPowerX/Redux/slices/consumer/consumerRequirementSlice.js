
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import consumerrequirementApi from '../../api/consumer/consumerRequirementApi';

const initialState = {
    requirements: [],  // Stores the list of requirements
    loading: false,    // Loading state to track API requests
    error: null,       // To track any errors during API calls
};

// Async Thunk for Fetching Requirements
export const fetchRequirements = createAsyncThunk(
    'consumerRequirement/fetchRequirements',
    async (id, { rejectWithValue }) => {
        try {
            const response = await consumerrequirementApi.getAllrequirementsById(id); // Assuming API call to fetch requirements by id
     
            return response.data;
        } catch (error) {
            // In case of an error, return the error message
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch requirements');
        }
    }
);

const consumerRequirementSlice = createSlice({
    name: 'consumerRequirement',
    initialState,
    reducers: {
        // Optional: Local state update for immediate UI feedback
        addRequirement: (state, action) => {
            state.requirements.push(action.payload);  // Add new requirement to the list
        },
        removeRequirement: (state, action) => {
            // Remove requirement by its ID
            state.requirements = state.requirements.filter(req => req.id !== action.payload);
        },
        //add updated requirement to the list
        updateRequirementInList: (state, action) => {
            const index = state.requirements.findIndex(req => req.id === action.payload.id);
            if (index !== -1) {
                state.requirements[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Handling Fetch Requirements
            .addCase(fetchRequirements.pending, (state) => {
                state.loading = true;   // Set loading to true while fetching
                state.error = null;     // Reset error state
            })
            .addCase(fetchRequirements.fulfilled, (state, action) => {
                state.loading = false;  // Set loading to false after successful fetch
                state.requirements = action.payload; // Update requirements list with fetched data
            })
            .addCase(fetchRequirements.rejected, (state, action) => {
                state.loading = false;  // Set loading to false after failed fetch
                state.error = action.payload; // Store error message
            })
            ;
    },
});

export const { addRequirement, removeRequirement } = consumerRequirementSlice.actions;

export default consumerRequirementSlice.reducer;
