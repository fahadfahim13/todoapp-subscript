const projects = require('../database/project-queries.js');

async function getAllProjects(req, res) {
    const result = await projects.all(req.params.organizationId);
    if (result.type === 'ERROR') {
        return res.status(500).send('Error fetching all projects');
    }
    return res.send(result.payload);
}

async function getProject(req, res) {
    const result = await projects.get(req.params.id);
    if (result.type === 'ERROR') {
        return res.status(500).send('Error fetching project');
    }
    if (!result.payload) {
        return res.status(404).send('Project not found');
    }
    return res.send(result.payload);
}

async function createNewProject(req, res) {
    const { name, organizationId } = req.body;
    
    if (!name || !organizationId) {
        return res.status(400).send('Name and organization ID are required');
    }

    const result = await projects.create(name, organizationId);
    if (result.type === 'ERROR') {
        return res.status(500).send('Error creating project');
    }
    return res.send(result.payload);
}

async function getProjectTodos(req, res) {
    const result = await projects.getTodos(req.params.id);
    if (result.type === 'ERROR') {
        return res.status(500).send('Error fetching project todos');
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
