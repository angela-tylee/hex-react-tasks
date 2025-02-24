import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/scss/all.scss';
import App from './App.jsx';
// import { MessageProvider } from './store/MessageContext.jsx';
import { store } from './store/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <MessageProvider> */}
      <Provider store={store}>
        <App />
      </Provider>
    {/* </MessageProvider> */}
  </StrictMode>
);
