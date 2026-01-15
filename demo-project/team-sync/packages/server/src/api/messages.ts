import { Router, Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { ApiResponse, Message } from '../types';

export default function messagesRouter(messageService: MessageService): Router {
  const router = Router();

  /**
   * GET /api/messages/:roomId
   * Get all messages for a room
   */
  router.get('/:roomId', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const messages = messageService.getMessagesByRoom(roomId);
    
    const response: ApiResponse<Message[]> = {
      success: true,
      data: messages,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * GET /api/messages/:roomId/recent
   * Get recent messages for a room
   */
  router.get('/:roomId/recent', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const messages = messageService.getRecentMessages(roomId, limit);
    
    const response: ApiResponse<Message[]> = {
      success: true,
      data: messages,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * GET /api/messages/:roomId/search
   * Search messages in a room
   */
  router.get('/:roomId/search', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
        timestamp: new Date()
      });
    }
    
    const messages = messageService.searchMessages(roomId, query);
    
    const response: ApiResponse<Message[]> = {
      success: true,
      data: messages,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  /**
   * POST /api/messages
   * Create a new message (alternative to WebSocket)
   */
  router.post('/', (req: Request, res: Response) => {
    const messageData = req.body;
    
    if (!messageData.content || !messageData.roomId || !messageData.userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: content, roomId, userId',
        timestamp: new Date()
      });
    }
    
    const message = messageService.addMessage(messageData);
    
    const response: ApiResponse<Message> = {
      success: true,
      data: message,
      timestamp: new Date()
    };
    
    res.status(201).json(response);
  });

  /**
   * DELETE /api/messages/:roomId/:messageId
   * Delete a message
   */
  router.delete('/:roomId/:messageId', (req: Request, res: Response) => {
    const { roomId, messageId } = req.params;
    const deleted = messageService.deleteMessage(messageId, roomId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
        timestamp: new Date()
      });
    }
    
    const response: ApiResponse<void> = {
      success: true,
      timestamp: new Date()
    };
    
    res.json(response);
  });

  return router;
}
