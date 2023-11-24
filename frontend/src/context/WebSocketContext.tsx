import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const WebSocketContext = createContext<Socket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    try {
      // Construct WebSocket URL from environment variables
      const wsUrl = `${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`;
      const newSocket = io(wsUrl); // Attempt to connect to the server
      setSocket(newSocket);
    } catch (error) {
      console.error("WebSocket Connection Error:", error);
    }
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
