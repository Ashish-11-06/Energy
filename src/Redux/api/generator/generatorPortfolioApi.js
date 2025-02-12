import axiosInstance from "../../axiosInstance";

const generatorPortfolioApi = {
  // Fetch all projects by ID
  getAllProjectsById: (id) => {
    return axiosInstance.get(`/energy/generation-portfolio/${id}`);
  },

  // Add a new project
  addProject: (newProject) => {
    return axiosInstance.post('/energy/generation-portfolio', newProject);
  },

  // Update an existing project
  updateProject: (updatedProject) => {
    return axiosInstance.put(`/energy/generation-portfolio/${updatedProject.id}`, updatedProject);
  },

  // Delete a project by ID
  deleteProject: (projectId) => {
    return axiosInstance.delete(`/energy/generation-portfolio/${projectId}`);
  },
};

export default generatorPortfolioApi;
