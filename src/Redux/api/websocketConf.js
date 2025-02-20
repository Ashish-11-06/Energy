// src/api/websocketConf.js

export const SOCKET_URL = 'ws://192.168.1.34:8001';
export const SOCKET_PATH = '/api/energy/ws/test-negotiation/';

// Function to get user ID from local storage
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  console.log(user);
  return user ? user.id : 1; // Adjust this based on your user object structure
};

export const NOTIFICATION_PATH = () => {
  const id = getUserId();
  return id ? `/api/notifications/${id}/` : null; // Return null if no ID is found
};

export const FULL_URL = SOCKET_URL + SOCKET_PATH;
export const NOTIFICATION_URL = SOCKET_URL + NOTIFICATION_PATH();