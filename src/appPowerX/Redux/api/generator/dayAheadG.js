import { message } from "antd";
import axiosInstance from "../../axiosInstance";

const dayAheadApi = {
  dayAheadData: async () => {
    return axiosInstance.get('/next-day-predictions');
  },
  addDayAheadData: async (dayAheadGeneration) => {
    // console.log(dayAheadGeneration);
    
    return axiosInstance.post('/day-ahead-generation', dayAheadGeneration);
  },
  getDayAhead: () => {
    return axiosInstance.get(`/tableData`);
  },
  mcvData: async () => {
    try {
      const response = await axiosInstance.get(`/MCVData`);
      // console.log('res', response);
      return response.data; // Ensure only data is returned
    } catch (error) {
      message.error(error);
      console.error("Error fetching MCV Data:", error);
      throw error; // Rethrow for proper error handling
    }
  },
  mcpData: async () => {
    try {
      const response = await axiosInstance.get(`/MCPData`);
      // console.log('res', response);
      return response.data; // Ensure only data is returned
    } catch (error) {
      console.error("Error fetching MCP Data:", error);
      throw error; // Rethrow for proper error handling
    }
  },
};

export default dayAheadApi;
