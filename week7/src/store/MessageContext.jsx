import { createContext, useState, useEffect, useRef } from 'react';
// import { Toast } from 'bootstrap';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const successMessage = useRef(null);

  useEffect(() => {
    successMessage.current = new window.bootstrap.Toast('#myToast');
  }, []);

  const showMessage = (type, text) => {
  if (successMessage.current) {
    successMessage.current.hide();
  }
  
  setMessageType(type);
  setMessage(text);
  
  setTimeout(() => {
    successMessage.current?.show();
  }, 0);
  
  setTimeout(() => {
    clearMessage();
    successMessage.current?.hide();
  }, 2000);
  };

  const clearMessage = () => {
    setMessageType('');
    setMessage('');
  };

  return (
    <MessageContext.Provider value={{ messageType, message, showMessage, clearMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
