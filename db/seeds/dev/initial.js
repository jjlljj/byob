const employmentData = require('../../data/employment-data.json')

exports.seed = function(knex, Promise) {
  return knex('years').del()
    .then(() => knex('groups').del())
    .then(function () {

      const seededGroups = employmentData.map(group => createGroup(knex, group))

      return Promise.all(seededGroups)
    })
    .catch(error => {
      console.log(`Error seeding data: ${error}`)
    })
};


const createGroup = (knex, group) => {
  return knex('groups').insert({
    group: group.group,
    age: group.ages,
    gender: group.gender,
    ethnicity: group.ethnicity
  }, 'id')
    .then(groupId => {

      yearsPromises = group.years.map(year => {
        return createYear(knex, { year: year.year, group_id: groupId, unemployment_score: year.score })
      })
    })
}

const createYear = (knex, year) => {
  return knex('years').insert(year)
}

