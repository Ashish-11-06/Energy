export const fetchOptimizedCombinationsXHR = (modalData, onProgress, onLoad, onError) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://52.66.186.241:8000/api/energy/optimize-capactiy", true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Add Bearer token from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        console.log(`Token added to headers: ${token}`);
      } else {
        console.log("No token found in localStorage");
      }
    } catch (err) {
      console.error("Error getting token from localStorage:", err);
    }

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        onLoad(response);
        onProgress(100);
      } else {
        onError("Failed to fetch combinations.");
      }
    };

    xhr.onerror = () => {
      onError("Failed to fetch combinations.");
    };

    xhr.send(JSON.stringify(modalData));
  } catch (error) {
    console.error("Error in fetchOptimizedCombinationsXHR:", error);
    onError("An error occurred while fetching combinations.");
  }
};
