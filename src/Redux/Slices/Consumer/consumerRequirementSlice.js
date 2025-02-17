
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import consumerrequirementApi from '../../api/consumer/consumerRequirenmentApi';

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

// Async Thunk for Adding Requirement
export const addNewRequirement = createAsyncThunk(
    'consumerRequirement/addRequirement',
    async (requirementData, { rejectWithValue }) => {
        // console.log('req data slice',requirementData);
        
        try {
            // Make API call to add a new requirement
            const response = await consumerrequirementApi.addRequirement(requirementData);
            // console.log(response.data);
            
            return response.data;
        } catch (error) {
            // Handle errors
            return rejectWithValue(error.response?.data?.error || 'Failed to add requirement');
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
            // Handling Add Requirement
            .addCase(addNewRequirement.pending, (state) => {
                state.loading = true;   // Set loading to true while adding
                state.error = null;     // Reset error state
            })
            .addCase(addNewRequirement.fulfilled, (state, action) => {
                state.loading = false;  // Set loading to false after adding successfully
                state.requirements.push(action.payload); // Add new requirement to the list
            })
            .addCase(addNewRequirement.rejected, (state, action) => {
                state.loading = false;  // Set loading to false after failed add
                state.error = action.payload; // Store error message
            });
    },
});

export const { addRequirement, removeRequirement } = consumerRequirementSlice.actions;

export default consumerRequirementSlice.reducer;
