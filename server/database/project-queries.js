const knex = require("./connection.js");


const projectsQueries = {
    async create(name, organizationId) {
        const results = await knex('projects')
            .insert({
                name,
                organization_id: organizationId
            })
            .returning('*');
        return results[0];
    },

    async all(organizationId) {
        return knex('projects')
            .where({ organization_id: organizationId })
            .select('*');
    },

    async get(id) {
        const results = await knex('projects')
            .where({ id })
            .select('*');
        return results[0];
    },

    async getTodos(projectId) {
        return knex('todos')
            .where({ project_id: projectId })
            .leftJoin('users', 'todos.assigned_user_id', 'users.id')
            .select('todos.*', 'users.name as assigned_user_name', 'users.email as assigned_user_email');
    }
};

module.exports = projectsQueries;