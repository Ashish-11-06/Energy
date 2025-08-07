import axiosInstance from '../axiosInstance';

const generationDataApi = {
    getGeneratorList: () => {
        return axiosInstance.get(`/generation-data`);
    },

}

export default generationDataApi;