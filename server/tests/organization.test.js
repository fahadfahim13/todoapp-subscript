process.env.NODE_ENV = 'test';
const { uniqueId } = require('lodash');
const request = require('./util/httpRequests.js');
const getBody = response => response.body;

describe('Organization API', () => {
  let accessToken;

  beforeAll(async () => {
    const loginDetails = { email: 'fahadfahim13@gmail.com', password: 'Pass123' };
    const loginResponse = await request.post('/login', loginDetails).then(getBody);
    accessToken = loginResponse.accessToken;
  });

  beforeEach(async () => {
    await request.delete('/organizations').set('Authorization', `Bearer ${accessToken}`);
  });

  describe('GET /organizations', () => {
    it('should get all organizations', async () => {
      const response = await request.get('/organizations').set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.type).toBe('SUCCESS');
      expect(Array.isArray(response.body.payload)).toBe(true);
    });
  });

  describe('POST /organizations', () => {
    it('should create a new organization', async () => {
      const newOrganization = { name: 'Test Organization' };
      const response = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response.type).toBe('SUCCESS');
      expect(response.payload).toHaveProperty('id');
      expect(response.payload).toHaveProperty('name', newOrganization.name);
    });

    it('should not create an organization without a name', async () => {
      const response = await request.post('/organizations', {}).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /organizations/:id', () => {
    it('should get an organization by id', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const response = await request.get(`/organizations/${createdOrganization.payload.id}`).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response.type).toBe('SUCCESS');
      expect(response.payload).toHaveProperty('id', createdOrganization.payload.id);
      expect(response.payload).toHaveProperty('name', newOrganization.name);
    });

    it('should return 404 if organization not found', async () => {
      const response = await request.get('/organizations/9999').set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /organizations/:id/users', () => {
    it('should get users for an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const response = await request.get(`/organizations/${createdOrganization.payload.id}/users`).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response.type).toBe('SUCCESS');
      expect(Array.isArray(response.payload)).toBe(true);
    });
  });

  describe('POST /organizations/:id/users', () => {
    it('should add a user to an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const uid = Math.random();
      const newUser = { name: 'Jane Doe', email: `jane+${uid}@example.com`, password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.post(`/organizations/${createdOrganization.payload.id}/users`, { userId: createdUser.id }).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response.type).toBe('SUCCESS');
      expect(response.payload).toHaveProperty('organization_id', createdOrganization.payload.id);
      expect(response.payload).toHaveProperty('user_id', createdUser.id);
    });

    it('should not add a user to an organization without userId', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const response = await request.post(`/organizations/${createdOrganization.payload.id}/users`, {}).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /organizations/:id/users', () => {
    it('should remove a user from an organization', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const uid = Math.random();
      const newUser = { name: 'Jane Doe', email: `jane+${uid}@example.com`, password: 'password123' };
      const createdUser = await request.post('/users', newUser).then(getBody);
      const response = await request.post(`/organizations/${createdOrganization.payload.id}/users`, { userId: createdUser.id }).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      expect(response.type).toBe('SUCCESS');
      expect(response.payload).toHaveProperty('organization_id', createdOrganization.payload.id);
      expect(response.payload).toHaveProperty('user_id', createdUser.id);
      const responseDelete = await request.delete(`/organizations/${createdOrganization.payload.id}/users`).send({ userId: createdUser.id }).set('Authorization', `Bearer ${accessToken}`);
      expect(responseDelete.status).toBe(200);
    });

    it('should not remove a user from an organization without userId', async () => {
      const newOrganization = { name: 'New Organization' };
      const createdOrganization = await request.post('/organizations', newOrganization).set('Authorization', `Bearer ${accessToken}`).then(getBody);
      const response = await request.deleteWithBody(`/organizations/${createdOrganization.payload.id}/users`, {}).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });
  });
});
