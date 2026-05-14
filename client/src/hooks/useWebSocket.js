import { useChat } from '../context/ChatContext';

export const useWebSocket = () => {
  return useChat();
};