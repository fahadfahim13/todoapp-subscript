const knex = require("./connection.js");

async function all() {
    try {
        const results = await knex('todos');
        return {
            type: 'SUCCESS',
            payload: results
        };
    } catch (error) {
        console.error('Error fetching all todos:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function allWithProjectId(projectId) {
    try {
        const results = await knex('todos')
            .where({ project_id: projectId })
            .leftJoin('users', 'todos.assigned_user_id', 'users.id')
            .select('todos.*', 'users.name as assigned_user_name', 'users.email as assigned_user_email');
        return {
            type: 'SUCCESS',
            payload: results
        };
    } catch (error) {
        console.error('Error fetching todos with project ID:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function get(id) {
    try {
        const results = await knex('todos').where({ id });
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error fetching todo:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function getForUser(id, userId) {
    try {
        const results = await knex('todos')
            .where({ 'todos.id': id, 'todos.assigned_user_id': userId })
            .leftJoin('users', 'todos.assigned_user_id', 'users.id')
            .select('todos.*', 'users.name as assigned_user_name', 'users.email as assigned_user_email');
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error fetching todo for user:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function create(title, order, projectId, assignedUserId = null) {
    try {
        const results = await knex('todos')
            .insert({ 
                title, 
                order, 
                project_id: projectId,
                assigned_user_id: assignedUserId 
            })
            .returning('*');
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error creating todo:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function update(id, properties) {
    try {
        const results = await knex('todos').where({ id }).update({ ...properties }).returning('*');
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error updating todo:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function assignUser(id, userId) {
    try {
        const results = await knex('todos')
            .where({ id })
            .update({ assigned_user_id: userId })
            .returning('*');
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error assigning user to todo:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function checkUser(id, userId) {
    try {
        const results = await knex('todos')
            .where({ id, assigned_user_id: userId })
            .select('*');
        return {
            type: 'SUCCESS',
            payload: results.length > 0 ? true : false
        };
    } catch (error) {
        console.error('Error checking user:', error);
        return {
            type: 'ERROR',
            payload: false
        };
    }
}

// delete is a reserved keyword
async function del(id) {
    try {
        const results = await knex('todos').where({ id }).del().returning('*');
        return {
            type: 'SUCCESS',
            payload: results[0]
        };
    } catch (error) {
        console.error('Error deleting todo:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

async function clear() {
    try {
        const results = await knex('todos').del().returning('*');
        return {
            type: 'SUCCESS',
            payload: results
        };
    } catch (error) {
        console.error('Error clearing todos:', error);
        return {
            type: 'ERROR',
            payload: error
        };
    }
}

module.exports = {
    all,
    get,
    allWithProjectId,
    assignUser,
    create,
    update,
    delete: del,
    clear,
    checkUser,
    getForUser
}