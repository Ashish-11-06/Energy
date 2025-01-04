import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import consumerrequirementApi from '../../api/consumer/consumerRequirenment';

const initialState = {
    requirements: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchRequirements = createAsyncThunk('consumerRequirement/fetchRequirements', async (id, { rejectWithValue }) => {
    try {
        const response = await consumerrequirementApi.getAllrequirementsById(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.error || 'Failed to fetch requirements');
    }
});

const consumerRequirementSlice = createSlice({
    name: 'consumerRequirement',
    initialState,
    reducers: {
        addRequirement: (state, action) => {
            state.requirements.push(action.payload);
        },
        removeRequirement: (state, action) => {
            state.requirements = state.requirements.filter(req => req.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequirements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRequirements.fulfilled, (state, action) => {
                state.loading = false;
                state.requirements = action.payload;
            })
            .addCase(fetchRequirements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    addRequirement,
    removeRequirement,
} = consumerRequirementSlice.actions;

export default consumerRequirementSlice.reducer;