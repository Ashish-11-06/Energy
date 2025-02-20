// src/features/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotification } from '../api/websocketConf'; // Ensure this points to your WebSocket URL

// Async thunk to connect to the WebSocket
export const connectWebSocket = createAsyncThunk(
  'notification/connectWebSocket',
  async (userId, { dispatch }) => {
    const socket = new WebSocket(getNotification(userId)); // Use the user ID to get the WebSocket URL

    // Handle connection open
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    // Listen for messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unread_count !== undefined) {
        dispatch(setNotificationCount(data.unread_count));
      }
    };

    // Handle connection errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle connection close
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Return the socket for potential future use
    return socket;
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'notification/disconnectWebSocket',
  async (socket, { dispatch }) => {
    if (socket) {
      socket.close();
      console.log('WebSocket connection closed');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    count: 0,
  },
  reducers: {
    setNotificationCount: (state, action) => {
      state.count = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(connectWebSocket.fulfilled, (state, action) => {
  //       // Optionally store the socket if needed
  //       // state.socket = action.payload;
  //     });
  // },
});

export const { setNotificationCount } = notificationSlice.actions;

export default notificationSlice.reducer;