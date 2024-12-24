// process.env.NODE_ENV = 'test';
// const request = require('./util/httpRequests.js');
// const getBody = response => response.body;

// describe('Authentication API', () => {
//   let createdUser;

//   beforeAll(async () => {
//     const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
//     createdUser = await request.post('/users', newUser).then(getBody);
//   });

//   describe('POST /login', () => {
//     it('should login a user and return access and refresh tokens', async () => {
//       const loginDetails = { email: 'john@example.com', password: 'password123' };
//       const response = await request.post('/login', loginDetails).then(getBody);
//       expect(response).toHaveProperty('accessToken');
//       expect(response).toHaveProperty('refreshToken');
//     });

//     it('should not login a user with incorrect password', async () => {
//       const loginDetails = { email: 'john@example.com', password: 'wrongpassword' };
//       const response = await request.post('/login', loginDetails);
//       expect(response.status).toBe(400);
//     });

//     it('should not login a user with non-existent email', async () => {
//       const loginDetails = { email: 'nonexistent@example.com', password: 'password123' };
//       const response = await request.post('/login', loginDetails);
//       expect(response.status).toBe(400);
//     });
//   });

//   describe('Protected routes', () => {
//     let accessToken;

//     beforeAll(async () => {
//       const loginDetails = { email: 'john@example.com', password: 'password123' };
//       const loginResponse = await request.post('/login', loginDetails).then(getBody);
//       accessToken = loginResponse.accessToken;
//     });

//     it('should access protected route with valid access token', async () => {
//       const response = await request.get('/protected-route').set('Authorization', `Bearer ${accessToken}`);
//       expect(response.status).toBe(200);
//     });

//     it('should not access protected route with invalid access token', async () => {
//       const response = await request.get('/protected-route').set('Authorization', 'Bearer invalidtoken');
//       expect(response.status).toBe(401);
//     });

//     it('should not access protected route without access token', async () => {
//       const response = await request.get('/protected-route');
//       expect(response.status).toBe(401);
//     });
//   });
// });
