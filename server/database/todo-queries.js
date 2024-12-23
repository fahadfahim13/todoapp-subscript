const knex = require("./connection.js");

async function all() {
    return knex('todos');
}

async function allWithProjectId(projectId) {
    return knex('todos')
        .where({ project_id: projectId })
        .leftJoin('users', 'todos.assigned_user_id', 'users.id')
        .select('todos.*', 'users.name as assigned_user_name', 'users.email as assigned_user_email');
}

async function get(id) {
    const results = await knex('todos')
        .where({ 'todos.id': id })
        .leftJoin('users', 'todos.assigned_user_id', 'users.id')
        .select('todos.*', 'users.name as assigned_user_name', 'users.email as assigned_user_email');
    return results[0];
}

async function create(title, order, projectId, assignedUserId = null) {
    const results = await knex('todos')
        .insert({ 
            title, 
            order, 
            project_id: projectId,
            assigned_user_id: assignedUserId 
        })
        .returning('*');
    return results[0];
}

async function update(id, properties) {
    const results = await knex('todos').where({ id }).update({ ...properties }).returning('*');
    return results[0];
}

async function assignUser(id, userId) {
    const results = await knex('todos')
        .where({ id })
        .update({ assigned_user_id: userId })
        .returning('*');
    return results[0];
}

// delete is a reserved keyword
async function del(id) {
    const results = await knex('todos').where({ id }).del().returning('*');
    return results[0];
}

async function clear() {
    return knex('todos').del().returning('*');
}

module.exports = {
    all,
    get,
    allWithProjectId,
    assignUser,
    create,
    update,
    delete: del,
    clear
}