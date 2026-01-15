import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MessageService } from './services/MessageService';
import { UserService } from './services/UserService';
import { WebSocketHandler } from './websocket/WebSocketHandler';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import messagesRouter from './api/messages';
import usersRouter from './api/users';

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Services
const messageService = new MessageService();
const userService = new UserService();

// API Routes
app.use('/api/messages', messagesRouter(messageService));
app.use('/api/users', usersRouter(userService));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'TeamSync API',
    poweredBy: '@arog Framework'
  });
});

// WebSocket
const wsHandler = new WebSocketHandler(io, messageService, userService);
wsHandler.initialize();

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`
======================================================================

   ███████╗██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 

  🚀 TeamSync Server is running!
  📍 Port: ${PORT}
  🌐 API: http://localhost:${PORT}
  🔌 WebSocket: http://localhost:${PORT}
  🤖 Powered by: AROG Framework
  
======================================================================
  `);
});

export { app, httpServer, io };
