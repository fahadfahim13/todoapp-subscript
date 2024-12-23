const knex = require("./connection.js");

const usersQueries = {
    async create(name, email, password) {
        const results = await knex('users')
            .insert({ name, email, password })
            .returning('*');
        return results[0];
    },

    async getByEmail(email) {
        const results = await knex('users')
            .where({ email })
            .select('*');
        return results[0];
    },

    async get(id) {
        const results = await knex('users')
            .where({ id })
            .select('*');
        return results[0];
    },

    async getOrganizations(userId) {
        return knex('organization_users')
            .where({ user_id: userId })
            .join('organizations', 'organization_users.organization_id', 'organizations.id')
            .select('organizations.*');
    },

    async getAssignedTodos(userId) {
        return knex('todos')
            .where({ assigned_user_id: userId })
            .select('*');
    }
};

module.exports = usersQueries;