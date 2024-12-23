// File: migrations/YYYYMMDDHHMMSS_create_organization_schema.js
exports.up = function(knex) {
    return knex.schema
      // Organizations table
      .createTable('organizations', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.timestamps(true, true);
      })
  
      // Users table
      .createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.timestamps(true, true);
      })
  
      // Organization Users (Many-to-Many for inviting users)
      .createTable('organization_users', (table) => {
        table.increments('id').primary();
        table.integer('organization_id').references('id').inTable('organizations').onDelete('CASCADE').notNullable();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.unique(['organization_id', 'user_id']);
        table.timestamps(true, true);
      })
  
      // Projects table
      .createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('organization_id').references('id').inTable('organizations').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
      })
  
      // Add foreign keys to existing todos table
      .alterTable('todos', (table) => {
        table.integer('project_id').references('id').inTable('projects').onDelete('CASCADE');
        table.integer('assigned_user_id').references('id').inTable('users').onDelete('SET NULL');
        table.timestamps(true, true);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .alterTable('todos', (table) => {
        table.dropColumn('project_id');
        table.dropColumn('assigned_user_id');
        table.dropTimestamps();
      })
      .dropTableIfExists('projects')
      .dropTableIfExists('organization_users')
      .dropTableIfExists('users')
      .dropTableIfExists('organizations');
  };