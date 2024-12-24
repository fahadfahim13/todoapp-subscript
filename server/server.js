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
app.patch('/todos/:id', users.verifyAccessToken, routes.patchTodo);

app.delete('/todos', routes.deleteAllTodos);
app.delete('/todos/:id', users.verifyAccessToken, routes.deleteTodo);

app.post('/login', users.loginUser);

app.get('/users', users.verifyAccessToken, users.getAllUsers);
app.get('/users/:id', users.verifyAccessToken, users.getUser);
app.get('/users/email/:email', users.verifyAccessToken, users.getUserByEmail);
app.post('/users', users.createNewUser);
app.get('/users/:id/organizations', users.verifyAccessToken, users.getUserOrganizations);
app.get('/users/:id/todos', users.verifyAccessToken, users.getUserAssignedTodos);

app.get('/organizations', users.verifyAccessToken, organizations.getAllOrganizations);
app.get('/organizations/:id', users.verifyAccessToken, organizations.getOrganization);
app.post('/organizations', users.verifyAccessToken, organizations.createNewOrganization);
app.get('/organizations/:id/users', users.verifyAccessToken, organizations.getOrganizationUsers);
app.post('/organizations/:id/users', users.verifyAccessToken, organizations.addUserToOrganization);
app.delete('/organizations/:id/users', users.verifyAccessToken, organizations.removeUserFromOrganization);

app.get('/projects', users.verifyAccessToken, projects.getAllProjects);
app.get('/projects/:id', users.verifyAccessToken, projects.getProject);
app.post('/projects', users.verifyAccessToken, projects.createNewProject);
app.get('/projects/:id/todos', users.verifyAccessToken, projects.getProjectTodos);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;