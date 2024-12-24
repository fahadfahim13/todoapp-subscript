const organizations = require('../database/organization-queries.js');
const users = require('../database/user-queries.js');

async function getAllOrganizations(req, res) {
  const allOrganizations = await organizations.all();
  return res.send(allOrganizations);
}

async function getOrganization(req, res) {
  const { userId } = req;

  const user = await users.get(userId);
  if (user.type === 'ERROR' || !user.payload) {
    return res.status(400).send('User not found');
  }

  const isUserInOrganization = await organizations.checkUser(req.params.id, userId);
  if (isUserInOrganization.type === 'ERROR' || !isUserInOrganization.payload) {
    return res.status(403).send('User does not belong to this organization');
  }
  const organization = await organizations.get(req.params.id);
  if (!organization) {
    return res.status(404).send('Organization not found');
  }
  return res.send(organization);
}

async function createNewOrganization(req, res) {
  const { name } = req.body;
  const { userId } = req;
  
  if (!name) {
    return res.status(400).send('Name is required');
  }

  const user = await users.get(userId);

  if(user.type === 'ERROR' || !user.payload) {
    return res.status(400).send('User not found');
  }

  const created = await organizations.create(name);
  const addedUser = await organizations.addUser(created.id, userId);
  if (!addedUser) {
    return res.status(500).send('Could not add user to organization');
  }
  return res.send(created);
}

async function getOrganizationUsers(req, res) {
  const { userId } = req;

  const user = await users.get(userId);
  if (user.type === 'ERROR' || !user.payload) {
    return res.status(400).send('User not found');
  }

  const isUserInOrganization = await organizations.checkUser(req.params.id, userId);
  if (isUserInOrganization.type === 'ERROR' || !isUserInOrganization.payload) {
    return res.status(403).send('User does not belong to this organization');
  }

  const foundUsers = await organizations.getUsers(req.params.id);
  return res.send(foundUsers);
}

async function addUserToOrganization(req, res) {
  const { userId: ownerId } = req;
  const { userId } = req.body;
  const organizationId = req.params.id;

  console.log(ownerId, userId, organizationId);

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const isUserInOrganization = await organizations.checkUser(req.params.id, ownerId);
  console.log(isUserInOrganization);

  if (isUserInOrganization.type === 'ERROR' || isUserInOrganization.payload === false) {
    return res.status(403).send('User does not belong to this organization');
  }

  const addedUser = await organizations.addUser(organizationId, userId);
  return res.send(addedUser);
}

async function removeUserFromOrganization(req, res) {
  const { userId: ownerId } = req;
  const { userId } = req.body;
  const organizationId = req.params.id;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const isUserInOrganization = await organizations.checkUser(req.params.id, ownerId);
  if (isUserInOrganization.type === 'ERROR' || !isUserInOrganization.payload) {
    return res.status(403).send('User does not belong to this organization');
  }

  await organizations.removeUser(organizationId, userId);
  return res.send({ message: 'User removed from organization' });
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
  getAllOrganizations: { method: getAllOrganizations, errorMessage: "Could not fetch all organizations" },
  getOrganization: { method: getOrganization, errorMessage: "Could not fetch organization" },
  createNewOrganization: { method: createNewOrganization, errorMessage: "Could not create organization" },
  getOrganizationUsers: { method: getOrganizationUsers, errorMessage: "Could not fetch organization users" },
  addUserToOrganization: { method: addUserToOrganization, errorMessage: "Could not add user to organization" },
  removeUserFromOrganization: { method: removeUserFromOrganization, errorMessage: "Could not remove user from organization" }
}

for (let route in toExport) {
  toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
