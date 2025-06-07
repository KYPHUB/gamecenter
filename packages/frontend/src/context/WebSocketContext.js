import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketCtx = createContext(null);

export const WebSocketProvider = ({ children }) => {
  // Uygulama boyunca tek bağlantı:
  const socket = useMemo(
    () => io('http://localhost:5000', { withCredentials: true }),
    []
  );

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
};

export const useSocket = () => useContext(SocketCtx);
