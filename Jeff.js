

app.delete('/api/v1/groups/:id', (request, response) => {
  const { id } = request.params;
  db('years')
    .where('group_id', id)
    .del()
    .then(() => {
      db('groups')
        .where('id', id)
        .del()
        .then(group => {
          if (!group) {
            return response.status(404).json({'error':'item requested not found'});
          }
          response.status(200).json(group);
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  
});


app.delete('/api/v1/years/:id', (request, response) => {
  const { id } = request.params;
  db('years')
    .where('id', id)
    .select()
    .del()
    .then(year => {
      if (!year) {
        return response.status(404).json({'error':'item requested not found'});
      }
      response.status(200).json(year);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// ==================================================================
// TESTS=============================================================
// ==================================================================

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
  beforeEach(done => {
    db.migrate.rollback().then(() => {
      db.migrate.latest().then(() => {
        return db.seed.run().then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/groups', () => {
    it('should return all groups', () => {
      return chai
        .request(server)
        .get('/api/v1/groups/')
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.a('array');
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('group');
          expect(response.body[0]).to.have.property('gender');
          expect(response.body[0]).to.have.property('age');
          expect(response.body[0]).to.have.property('ethnicity');
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return individual groups by id', () => {
      return chai
        .request(server)
        .get('/api/v1/groups/1')
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.a('array');
          expect(response).to.be.json;
          expect(response.body[0].id).to.equal(1);
          expect(response.body[0].group).to.equal(
            'White, non-Hispanic, Female'
          );
          expect(response.body[0].gender).to.equal('Female');
          expect(response.body[0].age).to.equal('Ages 18-19');
          expect(response.body[0].ethnicity).to.equal('White, non-Hispanic');
        });
    });

    it('should return 404 if id does not exist', () => {
      return chai
        .request(server)
        .get('/api/v1/groups/1000')
        .then(response => {
          expect(response).to.have.status(404);
        });
    });
  });

  describe('GET /api/v1/years', () => {
    it('should return all years', () => {
      return chai
        .request(server)
        .get('/api/v1/years/')
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('unemployment_score');
          expect(response.body[0]).to.have.property('year');
          expect(response.body[0]).to.have.property('group_id');
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return individual years by id', () => {
      return chai
        .request(server)
        .get('/api/v1/years/1')
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.a('array');
          expect(response).to.be.json;
          expect(response.body[0].id).to.equal(1);
          expect(response.body[0].unemployment_score).to.equal('13');
          expect(response.body[0].year).to.equal('1980');
          expect(response.body[0].group_id).to.equal(1);
        });
    });

    it('should return 404 if id does not exist', () => {
      return chai
        .request(server)
        .get('/api/v1/years/1000')
        .then(response => {
          expect(response).to.have.status(404);
        });
    });

    it('should', () => {
    
    });
  });

  it('should be a passing test suite', () => {
    true.should.equal(true);
  });
});
