const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  beforeEach(done => {
    db.migrate.rollback().then(() => {
      db.migrate.latest().then(() => {
        return db.seed.run().then(() => {
          done();
        });
      });
    });
  });

  it('should return 404', () => {
    return chai
      .request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API ROUTES', () => {
  describe('/api/v1/groups', () => {
    it('should return all groups', () => {
      return chai
        .request(server)
        .get('/api/v1/groups/')
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          expect(response.body[0]).to.have.property('id');
          response.body[0].should.have.property('group');
          response.body[0].should.have.property('gender');
          response.body[0].should.have.property('age');
          response.body[0].should.have.property('ethnicity');
        })
        .catch(error => {
          throw error;
        });
    });
  });

  it('should be a passing test suite', () => {
    true.should.equal(true);
  });
});
