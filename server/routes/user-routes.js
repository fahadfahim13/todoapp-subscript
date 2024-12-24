const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../database/user-queries.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = '7d';

function createUser(req, data) {
  const protocol = req.protocol,
    host = req.get('host'),
    id = data.id;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    url: `${protocol}://${host}/users/${id}`
  };
}

async function getAllUsers(req, res) {
  const result = await users.all();
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching all users');
  }
  return res.send(result.payload.map(_.curry(createUser)(req)));
}

async function getUser(req, res) {
  const result = await users.get(req.params.id);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching user');
  }
  if (!result.payload) {
    return res.status(404).send('User not found');
  }
  return res.send(createUser(req, result.payload));
}

async function getUserByEmail(req, res) {
  const result = await users.getByEmail(req.params.email);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching user by email');
  }
  if (!result.payload) {
    return res.status(404).send('User not found');
  }
  return res.send(createUser(req, result.payload));
}

async function createNewUser(req, res) {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).send('Name, email and password are required');
  }

  const existingUser = await users.getByEmail(email);
  if (existingUser.type === 'ERROR') {
    return res.status(500).send('Error checking existing user');
  }
  if (existingUser.payload) {
    return res.status(400).send('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await users.create(name, email, hashedPassword);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error creating user');
  }
  return res.send(createUser(req, result.payload));
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const result = await users.getByEmail(email);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching user by email');
  }
  if (!result.payload) {
    return res.status(400).send('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, result.payload.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid email or password');
  }

  const accessToken = jwt.sign({ id: result.payload.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  const refreshToken = jwt.sign({ id: result.payload.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

  return res.send({ accessToken, refreshToken });
}

async function getUserOrganizations(req, res) {
  const result = await users.getOrganizations(req.params.id);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching user organizations');
  }
  return res.send(result.payload);
}

async function getUserAssignedTodos(req, res) {
  const result = await users.getAssignedTodos(req.params.id);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching user\'s assigned todos');
  }
  return res.send(result.payload);
}

function addErrorReporting(func, message) {
  return async function(req, res) {
    try {
      return await func(req, res);
    } catch(err) {
      console.log(`${message} caused by: ${err}`);
      res.status(500).send(`Oops! ${message}.`);
    }
  }
}

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access token is required');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send('Invalid access token');
    }
    req.userId = decoded.id;
    next();
  });
}

function verifyRefreshToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Refresh token is required');
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid refresh token');
    }
    req.userId = decoded.id;
    next();
  });
}

const toExport = {
  getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users" },
  getUser: { method: getUser, errorMessage: "Could not fetch user" },
  getUserByEmail: { method: getUserByEmail, errorMessage: "Could not fetch user by email" },
  createNewUser: { method: createNewUser, errorMessage: "Could not create user" },
  loginUser: { method: loginUser, errorMessage: "Could not login user" },
  getUserOrganizations: { method: getUserOrganizations, errorMessage: "Could not fetch user organizations" },
  getUserAssignedTodos: { method: getUserAssignedTodos, errorMessage: "Could not fetch user's assigned todos" }
}

for (let route in toExport) {
  toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = { ...toExport, verifyAccessToken, verifyRefreshToken };