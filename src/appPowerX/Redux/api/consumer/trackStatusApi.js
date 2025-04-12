import axiosInstance from "../../../../Redux/axiosInstance";

const trackStatusApi ={
    fetchTrackStatus: (id) => {
        console.log(id);
        return axiosInstance.get(`/powerx/track-demand-status/${id}`);
    },
    fetchTrackStatusGenerationData: (id) => {
        console.log(id);
        return axiosInstance.get(`/powerx/track-generation-status/${id}`);
    },
   
};

export default trackStatusApi;