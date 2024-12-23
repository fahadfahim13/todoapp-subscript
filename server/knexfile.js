/* 
  Update with your config settings.
  The test database and development database are by default the same.
  Knex also allows for easy switching between databases. 
  But the .returning() method will only work for PostgreSQL, MSSQL, and Oracle databases.
*/
require('dotenv').config();
module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD
    },
    pool: {
      min: 2,
      max: 100,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      propagateCreateError: false
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD
    },
    pool: {
      min: 2,
      max: 100,         // Increase this if needed
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      propagateCreateError: false
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
