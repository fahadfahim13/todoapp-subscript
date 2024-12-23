process.env.NODE_ENV = 'test';
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('User API', () => {
  beforeEach(async () => {
    await request.delete('/users');
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const response = await request.post('/users', newUser).then(getBody);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', newUser.name);
      expect(response).toHaveProperty('email', newUser.email);
    });

    it('should not create a user with an existing email', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      await request.post('/users', newUser);
      const response = await request.post('/users', newUser);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.get(`/users/${createdUser.id}`).then(getBody);
      expect(response).toHaveProperty('id', createdUser.id);
      expect(response).toHaveProperty('name', newUser.name);
      expect(response).toHaveProperty('email', newUser.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request.get('/users/9999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /users/email/:email', () => {
    it('should get a user by email', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      await request.post('/users', newUser);
      const response = await request.get(`/users/email/${newUser.email}`).then(getBody);
      expect(response).toHaveProperty('email', newUser.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request.get('/users/email/nonexistent@example.com');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /users/:id/organizations', () => {
    it('should get organizations for a user', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.get(`/users/${createdUser.id}/organizations`).then(getBody);
      expect(Array.isArray(response)).toBe(true);
    });
  });

  describe('GET /users/:id/todos', () => {
    it('should get todos assigned to a user', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.get(`/users/${createdUser.id}/todos`).then(getBody);
      expect(Array.isArray(response)).toBe(true);
    });
  });
});
