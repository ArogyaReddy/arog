import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/MessageService';
import { UserService } from '../services/UserService';
import { Message, TypingIndicator } from '../types';

/**
 * WebSocketHandler - Manages all real-time WebSocket events
 * Handles chat messages, user presence, typing indicators
 */
export class WebSocketHandler {
  constructor(
    private io: Server,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  /**
   * Initialize WebSocket event handlers
   */
  initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // User joins
      socket.on('user:join', (data: { userId: string; roomId: string }) => {
        this.handleUserJoin(socket, data);
      });

      // New message
      socket.on('message:send', (data: Omit<Message, 'id' | 'timestamp'>) => {
        this.handleNewMessage(socket, data);
      });

      // Typing indicator
      socket.on('typing:start', (data: TypingIndicator) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing:stop', (data: TypingIndicator) => {
        this.handleTypingStop(socket, data);
      });

      // User disconnects
      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket);
      });
    });
  }

  /**
   * Handle user joining a room
   */
  private handleUserJoin(socket: Socket, data: { userId: string; roomId: string }): void {
    const { userId, roomId } = data;
    
    // Join the room
    socket.join(roomId);
    
    // Set user online
    this.userService.setUserOnline(userId, socket.id);
    
    // Get recent messages
    const messages = this.messageService.getRecentMessages(roomId, 50);
    
    // Send recent messages to the joining user
    socket.emit('messages:history', messages);
    
    // Notify room about new user
    const user = this.userService.getUserById(userId);
    if (user) {
      this.io.to(roomId).emit('user:joined', {
        user,
        timestamp: new Date()
      });
    }

    // Send online users list
    const onlineUsers = this.userService.getOnlineUsers();
    this.io.to(roomId).emit('users:online', onlineUsers);

    console.log(`👤 User ${userId} joined room ${roomId}`);
  }

  /**
   * Handle new message from client
   */
  private handleNewMessage(socket: Socket, data: Omit<Message, 'id' | 'timestamp'>): void {
    // Save message
    const message = this.messageService.addMessage(data);
    
    // Broadcast to room
    this.io.to(data.roomId).emit('message:new', message);
    
    console.log(`💬 Message from ${data.userName} in ${data.roomId}`);
  }

  /**
   * Handle typing started
   */
  private handleTypingStart(socket: Socket, data: TypingIndicator): void {
    socket.to(data.roomId).emit('typing:user-started', {
      userId: data.userId,
      userName: data.userName
    });
  }

  /**
   * Handle typing stopped
   */
  private handleTypingStop(socket: Socket, data: TypingIndicator): void {
    socket.to(data.roomId).emit('typing:user-stopped', {
      userId: data.userId
    });
  }

  /**
   * Handle user disconnect
   */
  private handleUserDisconnect(socket: Socket): void {
    // Set user offline
    this.userService.setUserOffline(socket.id);
    
    // Broadcast updated online users
    const onlineUsers = this.userService.getOnlineUsers();
    this.io.emit('users:online', onlineUsers);
    
    console.log(`❌ Client disconnected: ${socket.id}`);
  }
}
