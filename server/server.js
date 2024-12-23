const app = require('./server-config.js');
const routes = require('./server-routes.js');
const users = require('./routes/user-routes.js');
const organizations = require('./routes/organization-routes.js');
const projects = require('./routes/project-routes.js');

const port = process.env.PORT || 5000;

app.get('/todos', routes.getAllTodos);
app.get('/todos/project/:id', routes.getAllTodosWithProject);
app.get('/todos/:id', routes.getTodo);

app.post('/todos', routes.postTodo);
app.post('/todos/assign-user', routes.assignUser);
app.patch('/todos/:id', routes.patchTodo);

app.delete('/todos', routes.deleteAllTodos);
app.delete('/todos/:id', routes.deleteTodo);

app.get('/users', users.getAllUsers);
app.get('/users/:id', users.getUser);
app.get('/users/email/:email', users.getUserByEmail);
app.post('/users', users.createNewUser);
app.get('/users/:id/organizations', users.getUserOrganizations);
app.get('/users/:id/todos', users.getUserAssignedTodos);

app.get('/organizations', organizations.getAllOrganizations);
app.get('/organizations/:id', organizations.getOrganization);
app.post('/organizations', organizations.createNewOrganization);
app.get('/organizations/:id/users', organizations.getOrganizationUsers);
app.post('/organizations/:id/users', organizations.addUserToOrganization);
app.delete('/organizations/:id/users', organizations.removeUserFromOrganization);

app.get('/projects', projects.getAllProjects);
app.get('/projects/:id', projects.getProject);
app.post('/projects', projects.createNewProject);
app.get('/projects/:id/todos', projects.getProjectTodos);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;