import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import generatorPortfolioApi from '../../api/generator/generatorPortfolio'; // Updated API import

// Async thunk to get all projects by ID
export const getAllProjectsById = createAsyncThunk('portfolio/getAllProjects', async (id) => {
  const response = await generatorPortfolioApi.getAllProjectsById(id); // Use API method
  return response.data;  // Assuming API returns a list of projects
});

// Async thunk to add a new project
export const addProject = createAsyncThunk('portfolio/addProject', async (newProject) => {
  const response = await generatorPortfolioApi.addProject(newProject); // Use API method
  return response.data;  // Assuming API returns the created project
});

// Async thunk to update a project
export const updateProject = createAsyncThunk('portfolio/updateProject', async (updatedProject) => {
  const response = await generatorPortfolioApi.updateProject(updatedProject); // Use API method
  return response.data;  // Assuming API returns the updated project
});

// Async thunk to delete a project
export const deleteProject = createAsyncThunk('portfolio/deleteProject', async (projectId) => {
  await generatorPortfolioApi.deleteProject(projectId); // Use API method
  return projectId;  // Return the projectId to remove it from the store
});

// Initial state
const initialState = {
  projects: [],
  status: 'idle', // Can be 'loading', 'succeeded', 'failed'
  error: null,
};

// Portfolio slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getAllProjectsById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllProjectsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(getAllProjectsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Add project
      .addCase(addProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.projects.findIndex(
          (project) => project.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export reducer (no need to export actions because we're using thunks)
export default portfolioSlice.reducer;
