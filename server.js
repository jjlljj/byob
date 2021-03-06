const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
/* eslint-disable-next-line */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
require('dotenv').config();

const httpsRedirect = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect('https://' + req.headers.host + req.url);
  }
  next();
};

const checkAuth = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(403)
      .send({ error: 'request must contain a valid token' });
  } else {
    /* eslint-disable-next-line */
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(403).json({ error: 'invalid token' });
      } else if (!decoded.email.includes('@turing.io')) {
        return res.status(403).json({ error: 'not allowed' });
      } else {
        next();
      }
    });
  }
};
/* eslint-disable-next-line */
app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';
app.use(bodyParser.json());
app.use(express.static('public'));

if (environment === 'production') {
  app.use(httpsRedirect);
}

app.get('/', () => {});

app.get('/api/v1/groups', (request, response) => {
  db('groups')
    .select()
    .then(group => {
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/groups/:id', (request, response) => {
  const { id } = request.params;
  db('groups')
    .where('id', id)
    .select()
    .then(group => {
      if (!group.length) {
        return response.status(404).json({ error: 'item requested not found' });
      }
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/groups/:id', checkAuth, (request, response) => {
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
            return response
              .status(404)
              .json({ error: 'item requested not found' });
          }
          response.status(200).json(group);
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/groups', checkAuth, (request, response) => {
  const { group, ethnicity, age, gender } = request.body;
  const newGroup = { group, ethnicity, age, gender };
  for (let requiredParameter of ['group', 'ethnicity', 'age', 'gender']) {
    if (!newGroup[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { group: <string>, ethnicity: <string>, gender: <string>, age: <string> } You're missing a "${requiredParameter}" property`
      });
    }
  }

  db('groups')
    .insert(newGroup, 'id')
    .then(group => {
      response.status(201).json({ id: group[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/groups/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const { group, gender, age, ethnicity } = request.body;

  db('groups')
    .where('id', id)
    .update({
      group,
      gender,
      age,
      ethnicity
    })
    .then(updated => {
      if (!updated) {
        return response.status(422).json({ error: 'unable to update item' });
      }
      response.status(200).json('Record successfully updated');
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/years', (request, response) => {
  const { group_id } = request.query;

  if (group_id) {
    db('years')
      .where('group_id', group_id)
      .select()
      .then(years => {
        if (!years.length) {
          return response
            .status(404)
            .json({ error: 'item requested not found' });
        }
        response.status(200).json(years);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  } else {
    db('years')
      .select()
      .then(year => {
        response.status(200).json(year);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  }
});

app.get('/api/v1/years/:id', (request, response) => {
  const { id } = request.params;
  db('years')
    .where('id', id)
    .select()
    .then(year => {
      if (!year.length) {
        return response.status(404).json({ error: 'item requested not found' });
      }
      response.status(200).json(year);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/years', checkAuth, (request, response) => {
  const { year, group_id, unemployment_score } = request.body;
  const newYear = { year, group_id, unemployment_score };
  for (let requiredParameter of ['year', 'group_id', 'unemployment_score'])
    if (!newYear[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { year: <string>, group_id: <string>, unemployment_score: <string> } You're missing a "${requiredParameter}" property`
      });
    }

  db('years')
    .insert(newYear, 'id')
    .then(year => {
      response.status(201).json({ id: year[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/years/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  db('years')
    .where('id', id)
    .select()
    .del()
    .then(year => {
      if (!year) {
        return response.status(404).json({ error: 'item requested not found' });
      }
      response.status(200).json(year);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/years/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  const { unemployment_score, year } = request.body;

  db('years')
    .where('id', id)
    .update({
      unemployment_score,
      year
    })
    .then(updated => {
      if (!updated) {
        return response.status(422).json({ error: 'unable to update item' });
      }
      response.status(200).json('Record successfully updated');
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/authorize', (request, response) => {
  const { app_name, email } = request.body;

  if (email.includes('@turing.io')) {
    /* eslint-disable-next-line */
    const token = jwt.sign({ email, app_name }, process.env.SECRET_KEY, {
      expiresIn: '48h'
    });

    return response.status(201).json({ token });
  }
  response.status(404).json({ error: 'not valid' });
});

app.get('/', (request, response) => {
  response.send('working express server')
})

app.use((req, res) => {
  res.status(404).send('Sorry can\'t find that!');
});

app.listen(app.get('port'), () => {
  /* eslint-disable-next-line */
  console.log(`${app.locals.title} running on port ${app.get('port')}`);
});

module.exports = app;
