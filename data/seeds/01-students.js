
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'Andrew', cohort_id: 1},
        {name: 'Gavin', cohort_id: 2},
        {name: 'Camdon', cohort_id: 3}
      ]);
    });
};
