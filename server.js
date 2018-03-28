const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

app.use(express.static('/public'));

const httpsRedirect = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect('https://' + req.headers.host + req.url);
  }
  next();
};

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';
app.use(bodyParser.json());

if (environment === 'production') {
  app.use(httpsRedirect);
}

app.get('/', (request, response) => {
  response.sendfile('index.html');
});

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
        return response.status(404).json({'error':'item requested not found'});
      } 
      response.status(200).json(group);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/years', (request, response) => {
  db('years')
    .select()
    .then(year => {
      response.status(200).json(year);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/years/:id', (request, response) => {
  const { id } = request.params;
  db('years')
    .where('id', id)
    .select()
    .then(year => {
      if (!year.length) {
        return response.status(404).json({'error':'item requested not found'});
      } 
      response.status(200).json(year);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// app.set('secretKey', 'dudewhereismycar')
// app.post('/authenticate', (request, response) => {
//   const {name, email} = request.body
//   const token = jwt.sign({email, name}, app.get('secretKey'), { expiresIn: '48h' });
//   return response.status(201).json({token});
// });

app.use((req, res) => {
  res.status(404).send('Sorry can\'t find that!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on port ${app.get('port')}`);
});

module.exports = app;
