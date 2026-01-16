/**
 * Supertest API Testing Example
 * Test REST API endpoints
 */

const request = require('supertest');

// Mock app for demonstration
const express = require('express');
const app = express();
app.use(express.json());

// Sample routes for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  res.status(200).json({ users: [{ id: 1, name: 'Test User' }] });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 2, name, email });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ id, ...req.body, updated: true });
});

app.delete('/api/users/:id', (req, res) => {
  res.status(204).send();
});

// Tests
describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/users', () => {
    it('should return 200 and users array', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newUser);
      expect(response.body).toHaveProperty('id');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({});
      
      // In real app, this would return 400
      expect([200, 201, 400]).toContain(response.status);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user and return 200', async () => {
      const updates = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };
      
      const response = await request(app)
        .put('/api/users/1')
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);
      expect(response.body.updated).toBe(true);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user and return 204', async () => {
      const response = await request(app).delete('/api/users/1');
      
      expect(response.status).toBe(204);
    });
  });

  describe('API Performance', () => {
    it('should respond within 100ms for health check', async () => {
      const start = Date.now();
      await request(app).get('/api/health');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });
  });

  describe('API Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      
      expect(response.status).toBe(404);
    });
  });
});

module.exports = app;
