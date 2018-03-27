
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('groups', function(table) {
      table.increments('id').primary();
      table.string('group');
      table.string('gender');
      table.string('age');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('years', function(table) {
      table.increments('id').primary();
      table.string('unemployment_score');
      table.string('year');
      table.integer('group_id').unsigned();
      table.foreign('group_id').references('groups.id');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('years'),
    knex.schema.dropTable('groups')
  ]);
};
