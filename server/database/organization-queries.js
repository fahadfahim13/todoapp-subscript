const knex = require("./connection.js");

const organizationsQueries = {
    async create(name) {
        const results = await knex('organizations')
            .insert({ name })
            .returning('*');
        return results[0];
    },

    async all() {
        return knex('organizations')
            .select('*');
    },

    async get(id) {
        const results = await knex('organizations')
            .where({ id })
            .select('*');
        return results[0];
    },

    async getUsers(organizationId) {
        return knex('organization_users')
            .where({ organization_id: organizationId })
            .join('users', 'organization_users.user_id', 'users.id')
            .select('users.*');
    },

    async addUser(organizationId, userId) {
        const results = await knex('organization_users')
            .insert({
                organization_id: organizationId,
                user_id: userId
            })
            .returning('*');
        return results[0];
    },

    async removeUser(organizationId, userId) {
        return knex('organization_users')
            .where({
                organization_id: organizationId,
                user_id: userId
            })
            .del();
    }
};

module.exports = organizationsQueries;