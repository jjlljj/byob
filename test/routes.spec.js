const chai = require('chai')
const expect = chai.expect
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const environment = process.env.NODE_ENV || 'test'
const configuration = require('../knexfile')[environment]
const db = require('knex')(configuration)

// beforeEach(done => {
//   database.migrate.rollback().then(() => {
//     database.migrate.latest().then(() => {
//       return database.seed.run().then(() => {
//         done();
//       });
//     });
//   });
// });

describe('Client Routes', () => {
  it('should be a passing test suite', () => {
    (true).should.equal(true)
  })

})
