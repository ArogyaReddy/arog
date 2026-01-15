import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse, User } from '../types';

export default function usersRouter(userService: UserService): Router {
  const router = Router();

  /**
   * GET /api/users
   * Get all users
   */
  router.get('/', (_req: Request, res: Response) => {
    const users = userService.getAllUsers();
    
    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * GET /api/users/online
   * Get online users only
   */
  router.get('/online', (_req: Request, res: Response) => {
    const users = userService.getOnlineUsers();
    
    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * GET /api/users/:userId
   * Get user by ID
   */
  router.get('/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        timestamp: new Date()
      });
    }
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * POST /api/users
   * Create or update a user
   */
  router.post('/', (req: Request, res: Response) => {
    const userData = req.body;
    
    if (!userData.name || !userData.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email',
        timestamp: new Date()
      });
    }
    
    const user = userService.upsertUser(userData);
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      timestamp: new Date()
    };
    
    res.status(201).json(response);
  });

  /**
   * PATCH /api/users/:userId/status
   * Update user status
   */
  router.patch('/:userId/status', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: online, offline, or away',
        timestamp: new Date()
      });
    }
    
    userService.updateUserStatus(userId, status);
    const user = userService.getUserById(userId);
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  return router;
}
