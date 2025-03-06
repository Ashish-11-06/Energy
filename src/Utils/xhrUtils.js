export const fetchOptimizedCombinationsXHR = (modalData, onProgress, onLoad, onError) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.1.33:8001/api/energy/optimize-capactiy", true); // Update with the actual API endpoint
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        // Only set progress to 100% after processing the response
        onLoad(response);
        onProgress(100); // Set progress to 100% after response is processed
        onLoad(response);
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
