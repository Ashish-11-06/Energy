// src/features/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NOTIFICATION_URL } from '../api/websocketConf'; // Ensure this points to your WebSocket URL

export const connectWebSocket = createAsyncThunk(
  'notification/connectWebSocket',
  async (_, { dispatch }) => {
    const socket = new WebSocket(NOTIFICATION_URL); // Use your WebSocket URL

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

    // Handle connection close
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    // Return the socket for potential future use
    return socket;
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    count: 0,
    socket: null,
  },
  reducers: {
    setNotificationCount: (state, action) => {
      state.count = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWebSocket.fulfilled, (state, action) => {
        state.socket = action.payload; // Store the socket if needed
      });
  },
});

export const { setNotificationCount, setSocket } = notificationSlice.actions;

export default notificationSlice.reducer;