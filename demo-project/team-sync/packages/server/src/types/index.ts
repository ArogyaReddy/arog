export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  roomId: string;
  type: 'text' | 'system' | 'file';
}

export interface Room {
  id: string;
  name: string;
  users: string[];
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  roomId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
