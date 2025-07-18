import axiosInstance from '../axiosInstance';

const generatorApi = {
    getGeneratorList: () => {
        return axiosInstance.get(`/generator`);
    },
    editGenerator: ({data,id}) => {
        return axiosInstance.put(`/generator/${id}`,data);
    },
    deleteGenerator: (id) => {
        console.log('id in api delete',id);
        
        return axiosInstance.delete(`/generator/${id}`);
    },
}

export default generatorApi;