const _ = require('lodash');
const todos = require('./database/todo-queries.js');

function createToDo(req, data) {
  const protocol = req.protocol, 
    host = req.get('host'), 
    id = data.id;

  return {
    title: data.title,
    order: data.order,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`
  };
}

async function getAllTodos(req, res) {
  const result = await todos.all();
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching all todos');
  }
  return res.send(result.payload.map(_.curry(createToDo)(req)));
}

async function getAllTodosWithProject(req, res) {
  const result = await todos.allWithProjectId(req.params.projectId);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching todos with project ID');
  }
  return res.send(result.payload.map(_.curry(createToDo)(req)));
}

async function getTodo(req, res) {
  const result = await todos.get(req.params.id);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching todo');
  }
  return res.send(result.payload);
}

async function getTodoForUser(req, res) {
  const result = await todos.getForUser(req.params.id, req.params.userId);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error fetching todo for user');
  }
  return res.send(result.payload);
}

async function postTodo(req, res) {
  const result = await todos.create(req.body.title, req.body.order);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error creating todo');
  }
  return res.send(createToDo(req, result.payload));
}

async function assignUser(req, res) {
  const {todoId, userId} = req.body;

  const todo = await todos.get(todoId);
  if (todo.type === 'ERROR') {
    return res.status(500).send('Error fetching todo');
  }
  if (!todo.payload) {
    return res.status(400).send('Todo not found');
  }
  
  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const result = await todos.assignUser(todoId, userId);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error assigning user to todo');
  }
  return res.send(createToDo(req, result.payload));
}

async function patchTodo(req, res) {
  const {userId} = req;
  const checkUser = await todos.checkUser(req.params.id, userId);

  if (checkUser.type === 'ERROR') {
    return res.status(500).send('Error checking user');
  }
  if (!checkUser.payload) {
    return res.status(403).send('User does not have access to this todo');
  }
  const result = await todos.update(req.params.id, req.body);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error updating todo');
  }
  return res.send(createToDo(req, result.payload));
}

async function deleteAllTodos(req, res) {
  const result = await todos.clear();
  if (result.type === 'ERROR') {
    return res.status(500).send('Error clearing todos');
  }
  return res.send(result.payload.map(_.curry(createToDo)(req)));
}

async function deleteTodo(req, res) {
  const {userId} = req;
  const checkUser = await todos.checkUser(req.params.id, userId);

  if (checkUser.type === 'ERROR') {
    return res.status(500).send('Error checking user');
  }
  if (!checkUser.payload) {
    return res.status(403).send('User does not have access to this todo');
  }
  const result = await todos.delete(req.params.id);
  if (result.type === 'ERROR') {
    return res.status(500).send('Error deleting todo');
  }
  return res.send(createToDo(req, result.payload));
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
    getAllTodos: { method: getAllTodos, errorMessage: "Could not fetch all todos" },
    getAllTodosWithProject: { method: getAllTodosWithProject, errorMessage: "Could not fetch all todos of this project" },
    assignUser: { method: assignUser, errorMessage: "Could not assign this user" },
    getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
    postTodo: { method: postTodo, errorMessage: "Could not post todo" },
    patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
    deleteAllTodos: { method: deleteAllTodos, errorMessage: "Could not delete all todos" },
    deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
    getTodoForUser: { method: getTodoForUser, errorMessage: "Could not fetch todo for user" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
