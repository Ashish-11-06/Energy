import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import generatorPortfolioApi from '../../api/generator/generatorPortfolioApi'; // Updated API import

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
        // console.log("Fetched projects:", action.payload); // Log the fetched projects
        state.projects = action.payload;  // Assuming payload returns the correct structure
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
        const { energy_type } = action.payload; // Get the energy type from the payload
        const newProject = action.payload; // The new project to be added

        // Ensure the energy type exists in the state, if not initialize it as an empty array
        if (!state.projects[energy_type]) {
          state.projects[energy_type] = [];
        }

        // Add the new project to the respective energy type array
        state.projects[energy_type].push(newProject);
        console.log("Updated projects state:", state.projects); // Log the updated state after adding the project
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
        const { energy_type } = action.payload;
        const updatedProject = action.payload;

        console.log("Updating project:", updatedProject); // Log the updated project

        const index = state.projects[energy_type]?.findIndex(
          (project) => project.id === updatedProject.id
        );
        if (index !== -1) {
          state.projects[energy_type][index] = updatedProject;
        }

        console.log("Updated projects state:", state.projects); // Log the state after updating
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
        const { energy_type } = action.payload;

        console.log("Deleting project with ID:", action.payload.id); // Log the project being deleted

        // Filter out the project from the respective energy type array
        state.projects[energy_type] = state.projects[energy_type].filter(
          (project) => project.id !== action.payload.id
        );

        console.log("Updated projects state:", state.projects); // Log the state after deleting
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default portfolioSlice.reducer;
