const projects = require('../database/project-queries.js');


async function getAllProjects(req, res) {
  const allProjects = await projects.all();
  return res.send(allProjects);
}

async function getProject(req, res) {
  const project = await projects.get(req.params.id);
  if (!project) {
    return res.status(404).send('Project not found');
  }
  return res.send(project);
}

async function createNewProject(req, res) {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).send('Name is required');
  }

  const created = await projects.create(name);
  return res.send(created);
}

async function getProjectTodos(req, res) {
  const todos = await projects.getTodos(req.params.id);
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
  

const projectRoutes = {
  getAllProjects: { method: getAllProjects, errorMessage: "Could not fetch all projects" },
  getProject: { method: getProject, errorMessage: "Could not fetch project" },
  createNewProject: { method: createNewProject, errorMessage: "Could not create project" },
  getProjectTodos: { method: getProjectTodos, errorMessage: "Could not fetch project todos" }
}

for (let route in projectRoutes) {
  projectRoutes[route] = addErrorReporting(projectRoutes[route].method, projectRoutes[route].errorMessage);
}

module.exports = projectRoutes;
