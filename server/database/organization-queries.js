const knex = require("./connection.js");

const organizationsQueries = {
    async create(name) {
        try {
            const results = await knex('organizations')
                .insert({ name })
                .returning('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error creating organization:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async all() {
        try {
            const results = await knex('organizations')
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching all organizations:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async get(id) {
        try {
            const results = await knex('organizations')
                .where({ id })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error fetching organization:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async getUsers(organizationId) {
        try {
            const results = await knex('organization_users')
                .where({ organization_id: organizationId })
                .join('users', 'organization_users.user_id', 'users.id')
                .select('users.*');
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error fetching organization users:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async checkUser(organizationId, userId) {
        try {
            const results = await knex('organization_users')
                .where({
                    organization_id: organizationId,
                    user_id: userId
                })
                .select('*');
            return {
                type: 'SUCCESS',
                payload: results.length > 0 ? true : false
            };
        } catch (error) {
            console.error('Error checking user in organization:', error);
            return {
                type: 'ERROR',
                payload: false
            };
        }
    },

    async addUser(organizationId, userId) {
        try {
            const results = await knex('organization_users')
                .insert({
                    organization_id: organizationId,
                    user_id: userId
                })
                .returning('*');
            return {
                type: 'SUCCESS',
                payload: results[0]
            };
        } catch (error) {
            console.error('Error adding user to organization:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    },

    async removeUser(organizationId, userId) {
        try {
            const results = await knex('organization_users')
                .where({
                    organization_id: organizationId,
                    user_id: userId
                })
                .del();
            return {
                type: 'SUCCESS',
                payload: results
            };
        } catch (error) {
            console.error('Error removing user from organization:', error);
            return {
                type: 'ERROR',
                payload: error
            };
        }
    }
};

module.exports = organizationsQueries;