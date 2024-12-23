process.env.NODE_ENV = 'test';
const _ = require("lodash");
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('Todo API', () => {
  beforeEach(async () => {
    await request.delete('/todos');
  });

  describe('GET /todos', () => {
    it('should get all todos', async () => {
      const response = await request.get('/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'New Todo', order: 1 };
      const response = await request.post('/todos', newTodo).then(getBody);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('title', newTodo.title);
      expect(response).toHaveProperty('order', newTodo.order);
    });

    it('should not create a todo without a title', async () => {
      const response = await request.post('/todos', { order: 1 });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /todos/:id', () => {
    it('should get a todo by id', async () => {
      const newTodo = { title: 'New Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).then(getBody);
      const response = await request.get(`/todos/${createdTodo.id}`).then(getBody);
      expect(response).toHaveProperty('id', createdTodo.id);
      expect(response).toHaveProperty('title', newTodo.title);
      expect(response).toHaveProperty('order', newTodo.order);
    });

    it('should return 404 if todo not found', async () => {
      const response = await request.get('/todos/9999');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update a todo', async () => {
      const newTodo = { title: 'New Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).then(getBody);
      const updatedTodo = { title: 'Updated Todo', completed: true };
      const response = await request.patch(`/todos/${createdTodo.id}`, updatedTodo).then(getBody);
      expect(response).toHaveProperty('title', updatedTodo.title);
      expect(response).toHaveProperty('completed', updatedTodo.completed);
    });

    it('should return 500 if todo not found', async () => {
      const response = await request.patch('/todos/9999', { title: 'Updated Todo' });
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const newTodo = { title: 'New Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).then(getBody);
      const response = await request.delete(`/todos/${createdTodo.id}`);
      expect(response.status).toBe(200);
    });

    it('should return 500 if todo not found', async () => {
      const response = await request.delete('/todos/9999');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /todos/project/:id', () => {
    it('should get all todos for a project', async () => {
      const newProject = { name: 'New Project' };
      const createdProject = await request.post('/projects', newProject).then(getBody);
      const newTodo = { title: 'New Todo', order: 1, projectId: createdProject.id };
      await request.post('/todos', newTodo);
      const response = await request.get(`/todos/project/${createdProject.id}`).then(getBody);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0]).toHaveProperty('project_id', createdProject.id);
    });
  });

  describe('POST /todos/assign-user', () => {
    it('should assign a user to a todo', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const newTodo = { title: 'New Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).then(getBody);
      const response = await request.post('/todos/assign-user', { todoId: createdTodo.id, userId: createdUser.id }).then(getBody);
      expect(response).toHaveProperty('assigned_user_id', createdUser.id);
    });

    it('should return 500 if userId is not provided', async () => {
      const newTodo = { title: 'New Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).then(getBody);
      const response = await request.post('/todos/assign-user', { todoId: createdTodo.id });
      expect(response.status).toBe(500);
    });
  });
});