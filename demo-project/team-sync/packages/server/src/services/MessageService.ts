import { Message } from '../types';

/**
 * MessageService - Handles all message-related business logic
 * This service is used by both REST API and WebSocket handlers
 */
export class MessageService {
  private messages: Map<string, Message[]> = new Map();

  /**
   * Get all messages for a specific room
   * @param roomId - The room ID to fetch messages from
   * @returns Array of messages in the room
   */
  getMessagesByRoom(roomId: string): Message[] {
    return this.messages.get(roomId) || [];
  }

  /**
   * Add a new message to a room
   * @param message - The message to add
   * @returns The created message
   */
  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      timestamp: new Date()
    };

    const roomMessages = this.messages.get(message.roomId) || [];
    roomMessages.push(newMessage);
    this.messages.set(message.roomId, roomMessages);

    return newMessage;
  }

  /**
   * Delete a message by ID
   * @param messageId - The message ID to delete
   * @param roomId - The room ID containing the message
   * @returns true if deleted, false if not found
   */
  deleteMessage(messageId: string, roomId: string): boolean {
    const roomMessages = this.messages.get(roomId);
    if (!roomMessages) return false;

    const index = roomMessages.findIndex(m => m.id === messageId);
    if (index === -1) return false;

    roomMessages.splice(index, 1);
    this.messages.set(roomId, roomMessages);
    return true;
  }

  /**
   * Get recent messages (last N messages)
   * @param roomId - The room ID
   * @param limit - Number of recent messages to return
   * @returns Array of recent messages
   */
  getRecentMessages(roomId: string, limit: number = 50): Message[] {
    const messages = this.getMessagesByRoom(roomId);
    return messages.slice(-limit);
  }

  /**
   * Search messages by content
   * @param roomId - The room ID to search in
   * @param query - Search query string
   * @returns Array of matching messages
   */
  searchMessages(roomId: string, query: string): Message[] {
    const messages = this.getMessagesByRoom(roomId);
    return messages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
