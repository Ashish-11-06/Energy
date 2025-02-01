import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css'; // Use this for basic reset styles (CSS)
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux'; // Import Provider
import store from './Redux/store.js'  // Import your store
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Inter, sans-serif',
          colorPrimary: '#669800',
          colorLink: '#9A8406',
          colorBgBase: '#F5F6FB',
          colorBorder: '#E6E8F1',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);