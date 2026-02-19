// context/MessagesContext.tsx
import React, { createContext, useContext, useState,type ReactNode } from 'react';
import  Message from '../components/Message/Message'; // Adjust path

// Create context with just messages array and setter
const MessagesContext = createContext<{
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
} | undefined>(undefined);

// Custom hook
export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return context;
};

// Provider component
interface MessagesProviderProps {
  children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};