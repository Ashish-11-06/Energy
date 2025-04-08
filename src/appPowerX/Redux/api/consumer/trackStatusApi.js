import axiosInstance from "../../axiosInstance";

const trackStatusApi ={
    fetchTrackStatus: (id) => {
        console.log(id);
        return axiosInstance.get(`/track-demand-status/${id}`);
    },
    fetchTrackStatusGenerationData: (id) => {
        console.log(id);
        return axiosInstance.get(`/track-generation-status/${id}`);
    },
   
};

export default trackStatusApi;