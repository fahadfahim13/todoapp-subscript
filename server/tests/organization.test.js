process.env.NODE_ENV = 'test';
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('Organization API', () => {
  beforeEach(async () => {
    await request.delete('/organizations');
  });

  describe('GET /organizations', () => {
    it('should get all organizations', async () => {
      const response = await request.get('/organizations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /organizations', () => {
    it('should create a new organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const response = await request.post('/organizations', newOrganization).then(getBody);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', newOrganization.name);
    });

    it('should not create an organization without a name', async () => {
      const response = await request.post('/organizations', {});
      expect(response.status).toBe(400);
    });
  });

  describe('GET /organizations/:id', () => {
    it('should get an organization by id', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const response = await request.get(`/organizations/${createdOrganization.id}`).then(getBody);
      expect(response).toHaveProperty('id', createdOrganization.id);
      expect(response).toHaveProperty('name', newOrganization.name);
    });

    it('should return 404 if organization not found', async () => {
      const response = await request.get('/organizations/9999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /organizations/:id/users', () => {
    it('should get users for an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const response = await request.get(`/organizations/${createdOrganization.id}/users`).then(getBody);
      expect(Array.isArray(response)).toBe(true);
    });
  });

  describe('POST /organizations/:id/users', () => {
    it('should add a user to an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.post(`/organizations/${createdOrganization.id}/users`, { userId: createdUser.id }).then(getBody);
      expect(response).toHaveProperty('organization_id', createdOrganization.id);
      expect(response).toHaveProperty('user_id', createdUser.id);
    });

    it('should not add a user to an organization without userId', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const response = await request.post(`/organizations/${createdOrganization.id}/users`, {});
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /organizations/:id/users', () => {
    it('should remove a user from an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      await request.post(`/organizations/${createdOrganization.id}/users`, { userId: createdUser.id });
      const response = await request.delete(`/organizations/${createdOrganization.id}/users`, { userId: createdUser.id });
      expect(response.status).toBe(200);
    });

    it('should not remove a user from an organization without userId', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).then(getBody);
      const response = await request.delete(`/organizations/${createdOrganization.id}/users`, {});
      expect(response.status).toBe(400);
    });
  });
});
