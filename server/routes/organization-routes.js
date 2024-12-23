const organizations = require('../database/organization-queries.js');

async function getAllOrganizations(req, res) {
  const allOrganizations = await organizations.all();
  return res.send(allOrganizations);
}

async function getOrganization(req, res) {
  const organization = await organizations.get(req.params.id);
  if (!organization) {
    return res.status(404).send('Organization not found');
  }
  return res.send(organization);
}

async function createNewOrganization(req, res) {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).send('Name is required');
  }

  const created = await organizations.create(name);
  return res.send(created);
}

async function getOrganizationUsers(req, res) {
  const users = await organizations.getUsers(req.params.id);
  return res.send(users);
}

async function addUserToOrganization(req, res) {
  const { userId } = req.body;
  const organizationId = req.params.id;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const addedUser = await organizations.addUser(organizationId, userId);
  return res.send(addedUser);
}

async function removeUserFromOrganization(req, res) {
  const { userId } = req.body;
  const organizationId = req.params.id;

  if (!userId) {
    return res.status(400).send('User ID is required');
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
