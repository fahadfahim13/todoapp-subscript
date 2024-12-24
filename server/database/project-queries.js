const knex = require("./connection.js");

const projectsQueries = {
    async create(name, organizationId) {
        try {
            const results = await knex('projects')
                .insert({
                    name,
                    organization_id: organizationId
                })
                .returning('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error creating project:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async all(organizationId) {
        try {
            const results = await knex('projects')
                .where({ organization_id: organizationId })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching all projects:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async get(id) {
        try {
            const results = await knex('projects')
                .where({ id })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error fetching project:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async getTodos(projectId) {
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
            console.error('Error fetching project todos:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    }
};

module.exports = projectsQueries;