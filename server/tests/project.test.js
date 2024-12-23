process.env.NODE_ENV = 'test';
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('Project API', () => {
  beforeEach(async () => {
    await request.delete('/projects');
  });

  describe('GET /projects', () => {
    it('should get all projects', async () => {
      const response = await request.get('/projects');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /projects', () => {
    it('should create a new project', async () => {
      const newProject = { name: 'New Project' };
      const response = await request.post('/projects', newProject).then(getBody);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', newProject.name);
    });

    it('should not create a project without a name', async () => {
      const response = await request.post('/projects', {});
      expect(response.status).toBe(400);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a project by id', async () => {
      const newProject = { name: 'New Project' };
      const createdProject = await request.post('/projects', newProject).then(getBody);
      const response = await request.get(`/projects/${createdProject.id}`).then(getBody);
      expect(response).toHaveProperty('id', createdProject.id);
      expect(response).toHaveProperty('name', newProject.name);
    });

    it('should return 404 if project not found', async () => {
      const response = await request.get('/projects/9999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /projects/:id/todos', () => {
    it('should get todos for a project', async () => {
      const newProject = { name: 'New Project' };
      const createdProject = await request.post('/projects', newProject).then(getBody);
      const response = await request.get(`/projects/${createdProject.id}/todos`).then(getBody);
      expect(Array.isArray(response)).toBe(true);
    });
  });
});
