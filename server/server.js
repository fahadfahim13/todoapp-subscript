const app = require('./server-config.js');
const routes = require('./server-routes.js');

const port = process.env.PORT || 5000;

app.get('/todos', routes.getAllTodos);
app.get('/todos/project/:id', routes.getAllTodosWithProject);
app.get('/todos/:id', routes.getTodo);

app.post('/todos', routes.postTodo);
app.post('/todos/assign-user', routes.assignUser);
app.patch('/todos/:id', routes.patchTodo);

app.delete('/todos', routes.deleteAllTodos);
app.delete('/todos/:id', routes.deleteTodo);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;