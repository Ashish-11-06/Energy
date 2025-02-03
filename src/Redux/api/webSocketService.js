let socket = null; // Explicitly initialize socket as null

const SOCKET_URL = 'ws://192.168.1.35:8001';
const SOCKET_PATH = '/api/energy/ws/negotiation/';
const FULL_URL = SOCKET_URL + SOCKET_PATH;

    export const connectWebSocket = (user_id, tariff_id) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.warn('WebSocket is already connected.');
            return;
        }
    
        socket = new WebSocket(FULL_URL + `?user_id=${user_id}&tariff_id=${tariff_id}`);
    
        socket.onopen = () => {
            console.log('✅ Connected to WebSocket server:', FULL_URL);
        };
    
        socket.onclose = (event) => {
            console.warn('⚠️ Disconnected from WebSocket server:', event.reason);
        };
    
        socket.onerror = (error) => {
            console.error('❌ Connection error:', error);
        };
    
        // Handling incoming messages
        socket.onmessage = (event) => {
            console.log('📩 Raw message received:', event);
    
            try {
                const data = event.data; // Parse the JSON message
                console.log('📩 Parsed message from server:', data);
    
                // Check the type of the message and handle it accordingly
                if (data.type === "previous_offers") {
                    console.log('Received previous offers:', data.offers);
                } else {
                    console.log('Received unexpected message:', data);
                }
            } catch (error) {
                console.error('❌ Error parsing message:', error);
            }
        };
    };
    
    export const subscribeToEvent = (event, callback) => {
        if (!socket) {
            console.error('Socket not initialized. Call connectWebSocket first.');
            return;
        }
    
        // Using addEventListener to subscribe to events
        socket.addEventListener("message", (event) => {
            console.log('📩 Message event received:', event);
    
            try {
                const data = event.data; // Parse the JSON message
                console.log('📩 Parsed message:', data);
    
                if (data.event === event) {
                    callback(data.payload);
                }
            } catch (error) {
                console.error('❌ Error parsing message in subscribeToEvent:', error);
            }
        });
    };
    

export const sendEvent = (event, data) => {
    if (!socket) {
        console.error('Socket not initialized. Call connectWebSocket first.');
        return;
    }

    const message = {
        event: event,
        payload: data
    };

    socket.send(JSON.stringify(message));
};

// Optional: Add WebSocket disconnect functionality
export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        console.log('🔌 WebSocket connection closed');
    } else {
        console.warn('⚠️ Socket not initialized or already disconnected.');
    }
};
