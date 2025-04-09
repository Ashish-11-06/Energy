let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 3000; // 3 seconds

const SOCKET_URL = 'ws://172.31.16.56:8000';
const SOCKET_PATH = '/api/energy/ws/test-negotiation/';
const FULL_URL = SOCKET_URL + SOCKET_PATH;

// Event listeners storage
const eventListeners = new Map();

/**
 * Connects to WebSocket server with retry logic
 * @param {number} user_id - User ID
 * @param {number} tariff_id - Tariff ID
 * @param {function} onConnected - Callback when connection is established
 * @returns {WebSocket|null} - Returns the socket instance or null if failed
 */
export const connectWebSocket = (user_id, tariff_id, onConnected = null) => {
    // Clear any existing connection
    if (socket) {
        disconnectWebSocket();
    }

    try {
        const wsUrl = new URL(FULL_URL);
        wsUrl.searchParams.append('user_id', user_id);
        wsUrl.searchParams.append('tariff_id', tariff_id);

        socket = new WebSocket(wsUrl.toString());

        socket.onopen = () => {
            console.log('✅ WebSocket connected:', wsUrl.toString());
            reconnectAttempts = 0; // Reset reconnect counter
            if (onConnected) onConnected();
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log('🟢 WebSocket closed cleanly:', event.reason);
            } else {
                console.error('🔴 WebSocket connection lost:', event.reason);
                attemptReconnect(user_id, tariff_id, onConnected);
            }
        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            // Note: The browser doesn't expose detailed error info due to security
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.debug('📩 WebSocket message:', data);

                // Check if this is a registered event
                if (data.event && eventListeners.has(data.event)) {
                    const callbacks = eventListeners.get(data.event);
                    callbacks.forEach(callback => callback(data.payload));
                }
            } catch (error) {
                console.error('❌ Error parsing WebSocket message:', error);
            }
        };

        return socket;
    } catch (error) {
        console.error('❌ WebSocket initialization failed:', error);
        return null;
    }
};

/**
 * Attempts to reconnect to WebSocket server
 */
const attemptReconnect = (user_id, tariff_id, onConnected) => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`♻️ Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

        setTimeout(() => {
            connectWebSocket(user_id, tariff_id, onConnected);
        }, RECONNECT_INTERVAL);
    } else {
        console.error(`❌ Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached`);
    }
};

/**
 * Subscribes to a specific WebSocket event
 * @param {string} eventName - Event name to subscribe to
 * @param {function} callback - Callback function when event is received
 */
export const subscribeToEvent = (eventName, callback) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected when subscribing to event:', eventName);
        return;
    }

    if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
    }

    eventListeners.get(eventName).push(callback);
    console.log(`🔔 Subscribed to event: ${eventName}`);
};

/**
 * Unsubscribes from a WebSocket event
 * @param {string} eventName - Event name to unsubscribe from
 * @param {function} callback - Callback function to remove
 */
export const unsubscribeFromEvent = (eventName, callback) => {
    if (eventListeners.has(eventName)) {
        const callbacks = eventListeners.get(eventName);
        const index = callbacks.indexOf(callback);
        
        if (index !== -1) {
            callbacks.splice(index, 1);
            console.log(`🔕 Unsubscribed from event: ${eventName}`);
        }
    }
};

/**
 * Sends data through WebSocket
 * @param {string} event - Event name
 * @param {object} payload - Data to send
 */
export const sendEvent = (event) => {
    if (!socket) {
        console.error('Cannot send event - WebSocket not initialized');
        return false;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.error('Cannot send event - WebSocket not connected');
        return false;
    }

    try {
        socket.send(JSON.stringify(event));
        console.debug('📤 Sent event:', event);
        return true;
    } catch (error) {
        console.error('❌ Error sending WebSocket message:', error);
        return false;
    }
};

/**
 * Disconnects WebSocket cleanly
//  * @param {string} reason - Optional reason for disconnection
//  */
export const disconnectWebSocket = (reason = 'Client initiated disconnect') => {
    if (socket) {
        // Remove all event listeners
        eventListeners.clear();
        
        // Close connection
        if (socket.readyState === WebSocket.OPEN) {
            socket.close(1000, reason);
        }
        socket = null;
        console.log('🔌 WebSocket disconnected:', reason);
    }
};

/**
 * Get current WebSocket connection state
 * @returns {string} - Connection state as string
 */
export const getConnectionState = () => {
    if (!socket) return 'NOT_INITIALIZED';
    
    switch (socket.readyState) {
        case WebSocket.CONNECTING: return 'CONNECTING';
        case WebSocket.OPEN: return 'CONNECTED';
        case WebSocket.CLOSING: return 'DISCONNECTING';
        case WebSocket.CLOSED: return 'DISCONNECTED';
        default: return 'UNKNOWN';
    }
};