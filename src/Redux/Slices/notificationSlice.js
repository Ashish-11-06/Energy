/* eslint-disable no-unused-vars */
// src/features/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotification, getOffer, getPowerXNotification } from '../api/websocketConf'; // Ensure this points to your WebSocket URL

// WebSocket state to manage open connections
let notificationSocket = null;
let offerSocket = null;
let powerXSocket = null;

// Async thunk to connect to the WebSocket for notifications
export const connectWebSocket = createAsyncThunk(
  'notification/connectWebSocket',
  async (userId, { dispatch }) => {
    if (notificationSocket) {
      // console.log('Notification WebSocket already connected');
      return;
    }

    notificationSocket = new WebSocket(getNotification(userId));

    notificationSocket.onopen = () => {
      // console.log('Connected to Notification WebSocket server');
    };

    notificationSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unread_count !== undefined) {
        dispatch(setNotificationCount(data.unread_count));
      }
    };

    notificationSocket.onerror = (error) => {
      // console.error('Notification WebSocket error:', error);
    };

    notificationSocket.onclose = () => {
      // console.log('Disconnected from Notification WebSocket server');
      notificationSocket = null;
    };
  }
);
export const connectPowerXWebSocket = createAsyncThunk(
  'notification/connectWebSocket',
  async (userId, { dispatch }) => {
    if (powerXSocket) {
      // console.log('Notification WebSocket already connected');
      return;
    }

    powerXSocket = new WebSocket(getPowerXNotification(userId));

    powerXSocket.onopen = () => {
      // console.log('Connected to Notification WebSocket server');
    };

    powerXSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unread_count !== undefined) {
        dispatch(setPowerXCount(data.unread_count));
      }
    };

    powerXSocket.onerror = (error) => {
      // console.error('Notification WebSocket error:', error);
    };

    powerXSocket.onclose = () => {
      // console.log('Disconnected from Notification WebSocket server');
      powerXSocket = null;
    };
  }
);

// Async thunk to connect to the WebSocket for offers
export const connectOfferSocket = createAsyncThunk(
  'notification/connectOfferSocket',
  async (userId, { dispatch }) => {
    if (offerSocket) {
      // console.log('Offer WebSocket already connected');
      return;
    }

    offerSocket = new WebSocket(getOffer(userId));

    offerSocket.onopen = () => {
      // console.log('Connected to Offer WebSocket server');
    };

    offerSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.unread_count !== undefined) {
        dispatch(setOfferCount(data.unread_count));
      }
    };

    offerSocket.onerror = (error) => {
      // console.error('Offer WebSocket error:', error);
    };

    offerSocket.onclose = () => {
      // console.log('Disconnected from Offer WebSocket server');
      offerSocket = null;
    };
  }
);

// Async thunk to disconnect WebSockets
export const disconnectWebSocket = createAsyncThunk(
  'notification/disconnectWebSocket',
  async (_, { dispatch }) => {
    if (notificationSocket) {
      notificationSocket.close();
      notificationSocket = null;
      // console.log('Notification WebSocket connection closed');
    }
    if (powerXSocket) {
      powerXSocket.close();
      powerXSocket = null;
      // console.log('Notification WebSocket connection closed');
    }

    if (offerSocket) {
      offerSocket.close();
      offerSocket = null;
      // console.log('Offer WebSocket connection closed');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notificationCount: 0,
    offerCount: 0,  // Added offer count to store
    powerxCount: 0,
  },
  reducers: {
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    setPowerXCount: (state, action) => {
      state.powerxCount = action.payload;
    },
    setOfferCount: (state, action) => {  // New reducer for offer count
      state.offerCount = action.payload;
    },
  },
});

export const { setNotificationCount, setOfferCount,setPowerXCount } = notificationSlice.actions;

export default notificationSlice.reducer;
