import { decryptData } from "./cryptoHelper";

export const fetchOptimizedCombinationsXHR = (modalData, onProgress, onLoad, onError) => {
  try {
    const VITE_BASE_URL = import.meta.env.VITE_ALT_BASE_URL;
    const endpoint = `${VITE_BASE_URL}/energy/optimize-capactiy`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Attach token from localStorage if available
    try {
        const user = decryptData(localStorage.getItem('user'));
  // const userData= user?.user;
  // console.log('user data from xhrUtils', userData);
  // console.log('token from xhrUtils', userData?.token);
  
  
      // const userData = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.error("Error retrieving token from localStorage:", err);
    }

    // Progress event
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    // Load success
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        onLoad(response);
        onProgress(100);
      } else {
        onError("Failed to fetch combinations.");
      }
    };

    // Network error
    xhr.onerror = () => {
      onError("Failed to fetch combinations.");
    };

    // Send request
    xhr.send(JSON.stringify(modalData));
  } catch (error) {
    console.error("Error in fetchOptimizedCombinationsXHR:", error);
    onError("An error occurred while fetching combinations.");
  }
};
