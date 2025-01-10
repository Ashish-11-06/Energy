import { io } from 'socket.io-client';

let socket; // Declare socket at the module level

export const connectWebSocket = (user_id, tariff_id) => {
    if (!socket || !socket.connected) {
        socket = io('ws://19', {
            path: `/api/energy/ws/negotiation/`,
            query: { user_id, tariff_id }, // Pass user_id and tariff_id dynamically
            transports: ['websocket'], // Enforce WebSocket transport
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
        });
    }
};

export const subscribeToEvent = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    } else {
        console.error('Socket not initialized. Call connectWebSocket first.');
    }
};

export const sendEvent = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    } else {
        console.error('Socket not initialized. Call connectWebSocket first.');
    }
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('WebSocket connection closed');
    } else {
        console.error('Socket not initialized or already disconnected.');
    }
};
