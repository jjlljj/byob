const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const db = require('knex')(configuration)

const httpsRedirect = (req, res, next) => {
  if( req.headers['x-forwarded-proto'] !== 'https' ) {
    res.redirect("https://" + req.headers.host + req.url)
  }
  next()
}

app.set('port', process.env.PORT || 3000)
app.locals.title = "BYOB"
app.use(bodyParser.json())

if( environment === 'production' ) { app.use(httpsRedirect) }


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on port ${app.get('port')}`)
})

module.exports = app
