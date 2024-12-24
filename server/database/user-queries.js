const knex = require("./connection.js");

const usersQueries = {
    async create(name, email, password) {
        try {
            const results = await knex('users')
                .insert({ name, email, password })
                .returning('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async all() {
        try {
            const results = await knex('users');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching all users:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async getByEmail(email) {
        try {
            const results = await knex('users')
                .where({ email })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async get(id) {
        try {
            const results = await knex('users')
                .where({ id })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error fetching user:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async getOrganizations(userId) {
        try {
            const results = await knex('organization_users')
                .where({ user_id: userId })
                .join('organizations', 'organization_users.organization_id', 'organizations.id')
                .select('organizations.*');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching user organizations:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async getAssignedTodos(userId) {
        try {
            const results = await knex('todos')
                .where({ assigned_user_id: userId })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching assigned todos:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    }
};

module.exports = usersQueries;