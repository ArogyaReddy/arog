import { User } from '../types';

/**
 * UserService - Handles all user-related business logic
 * Manages user presence, status, and user data
 */
export class UserService {
  private users: Map<string, User> = new Map();
  private activeSessions: Map<string, string> = new Map(); // socketId -> userId

  /**
   * Get all users
   * @returns Array of all users
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Get user by ID
   * @param userId - The user ID
   * @returns User object or undefined
   */
  getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * Create or update a user
   * @param userData - User data
   * @returns The created/updated user
   */
  upsertUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const existingUser = Array.from(this.users.values())
      .find(u => u.email === userData.email);

    if (existingUser) {
      const updatedUser = { ...existingUser, ...userData, lastSeen: new Date() };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    }

    const newUser: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      lastSeen: new Date()
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Set user online status
   * @param userId - The user ID
   * @param socketId - The socket connection ID
   */
  setUserOnline(userId: string, socketId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.status = 'online';
      user.lastSeen = new Date();
      this.users.set(userId, user);
      this.activeSessions.set(socketId, userId);
    }
  }

  /**
   * Set user offline status
   * @param socketId - The socket connection ID
   */
  setUserOffline(socketId: string): void {
    const userId = this.activeSessions.get(socketId);
    if (userId) {
      const user = this.users.get(userId);
      if (user) {
        user.status = 'offline';
        user.lastSeen = new Date();
        this.users.set(userId, user);
      }
      this.activeSessions.delete(socketId);
    }
  }

  /**
   * Get online users
   * @returns Array of online users
   */
  getOnlineUsers(): User[] {
    return Array.from(this.users.values())
      .filter(u => u.status === 'online');
  }

  /**
   * Update user status
   * @param userId - The user ID
   * @param status - New status
   */
  updateUserStatus(userId: string, status: User['status']): void {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.lastSeen = new Date();
      this.users.set(userId, user);
    }
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
