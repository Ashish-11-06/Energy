import axios from 'axios';

const BASE_URL ="http://127.0.0.1:8000" 
// '{{base_url}}'; // Replace with the actual base URL

/**
 * API call to add customer requirements
 * @param {Object} customerData - The customer data to be sent in the API call
 * @returns {Promise} - The response from the API
 */
export const addCustomerRequirements = async (customerData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/energy/consumer-requirements/`,
      customerData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error while adding customer requirements:', error);
    throw error;
  }
};
