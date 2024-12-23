const _ = require('lodash');
const users = require('../database/user-queries.js');

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
  const allUsers = await users.all();
  return res.send(allUsers.map(_.curry(createUser)(req)));
}

async function getUser(req, res) {
  const user = await users.get(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  return res.send(createUser(req, user));
}

async function getUserByEmail(req, res) {
  const user = await users.getByEmail(req.params.email);
  if (!user) {
    return res.status(404).send('User not found');
  }
  return res.send(createUser(req, user));
}

async function createNewUser(req, res) {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).send('Name, email and password are required');
  }

  const existingUser = await users.getByEmail(email);
  if (existingUser) {
    return res.status(400).send('Email already exists');
  }

  const created = await users.create(name, email, password);
  return res.send(createUser(req, created));
}

async function getUserOrganizations(req, res) {
  const organizations = await users.getOrganizations(req.params.id);
  return res.send(organizations);
}

async function getUserAssignedTodos(req, res) {
  const todos = await users.getAssignedTodos(req.params.id);
  return res.send(todos);
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

const toExport = {
  getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users" },
  getUser: { method: getUser, errorMessage: "Could not fetch user" },
  getUserByEmail: { method: getUserByEmail, errorMessage: "Could not fetch user by email" },
  createNewUser: { method: createNewUser, errorMessage: "Could not create user" },
  getUserOrganizations: { method: getUserOrganizations, errorMessage: "Could not fetch user organizations" },
  getUserAssignedTodos: { method: getUserAssignedTodos, errorMessage: "Could not fetch user's assigned todos" }
}

for (let route in toExport) {
  toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;