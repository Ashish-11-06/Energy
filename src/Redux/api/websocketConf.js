// src/api/websocketConf.js

export const SOCKET_URL = 'ws://192.168.1.36:8000';
export const SOCKET_PATH = '/api/energy/ws/test-negotiation/';

// Function to get the notification WebSocket URL
export const getNotification = (id) => {
  return `${SOCKET_URL}/api/notifications/${id}/`;
};
export const getOffer = (id) => {
  return `${SOCKET_URL}/api/terms-sheet/${id}`;
};

export const getPowerXNotification = (id) => {
  return `${SOCKET_URL}/api/powerx/notifications/${id}/`;
};
// Full WebSocket URL for the main connection
export const FULL_URL = SOCKET_URL + SOCKET_PATH;
// export const NOTIFICATION_URL = SOCKET_URL + getNotification(id);
