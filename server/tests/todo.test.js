process.env.NODE_ENV = 'test';
const _ = require("lodash");
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('Todo API', () => {
  let accessToken;

  beforeAll(async () => {
    const loginDetails = { email: 'fahadfahim13@gmail.com', password: 'Pass123' };
    const loginResponse = await request.post('/login', loginDetails).then(getBody);
    accessToken = loginResponse.accessToken;
  });

  beforeEach(async () => {
    // await request.delete('/todos').set('Authorization', `Bearer ${accessToken}`);
  });

  describe('GET /todos', () => {
    it('should get all todos', async () => {
      const response = await request.get('/todos').set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'Test Todo', order: 1 };
      const response = await request.post('/todos', newTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('title', newTodo.title);
    });

    it('should not create a todo without a title', async () => {
      const response = await request.post('/todos', { order: 1 }).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /todos/:id', () => {
    it('should get a todo by id', async () => {
      const newTodo = { title: 'Test Todo', order: 1 };
      const createdTodo = await request.post('/todos', newTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const response = await request.get(`/todos/${createdTodo.id}`).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response).toHaveProperty('id', createdTodo.id);
      expect(response).toHaveProperty('title', newTodo.title);
    });

    it('should return 404 if todo not found', async () => {
      const response = await request.get('/todos/9999').set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });

//   describe('PATCH /todos/:id', () => {
//     it('should update a todo', async () => {
//       const newTodo = { title: 'Test Todo', order: 1 };
//       const createdTodo = await request.post('/todos', newTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
//       const updatedTodo = { title: 'Updated Todo' };
//       const response = await request.patch(`/todos/${createdTodo.payload.id}`, updatedTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
//       expect(response.type).toBe('SUCCESS');
//       expect(response.payload).toHaveProperty('id', createdTodo.payload.id);
//       expect(response.payload).toHaveProperty('title', updatedTodo.title);
//     });

//     it('should return 404 if todo not found', async () => {
//       const response = await request.patch('/todos/9999', { title: 'Updated Todo' }).set('Authorization', `Bearer ${accessToken}`);
//       expect(response.status).toBe(404);
//     });
//   });

//   describe('DELETE /todos/:id', () => {
//     it('should delete a todo', async () => {
//       const newTodo = { title: 'Test Todo', order: 1 };
//       const createdTodo = await request.post('/todos', newTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
//       const response = await request.delete(`/todos/${createdTodo.payload.id}`).set('Authorization', `Bearer ${accessToken}`);
//       expect(response.status).toBe(200);
//     });

//     it('should return 404 if todo not found', async () => {
//       const response = await request.delete('/todos/9999').set('Authorization', `Bearer ${accessToken}`);
//       expect(response.status).toBe(404);
//     });
//   });

//   describe('DELETE /todos', () => {
//     it('should delete all todos', async () => {
//       const newTodo = { title: 'Test Todo', order: 1 };
//       await request.post('/todos', newTodo).set('Authorization', `Bearer ${accessToken}`).then(getBody);
//       const response = await request.delete('/todos').set('Authorization', `Bearer ${accessToken}`);
//       expect(response.status).toBe(200);
//     });
//   });
});