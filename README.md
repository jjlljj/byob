[![Build Status](https://travis-ci.org/jjlljj/byob.svg?branch=master)](https://travis-ci.org/jjlljj/byob)

# Build Your Own Database 

## The Dream Team
  - Melissa Wagasky
  - James Logue
  - Jeff Goodall

## Heroku Deployment
- [can be found here](https://employment-data-be.herokuapp.com/)

## Synopsis

The main focus of this project will be to reinforce your understanding of CRUD methods, querying a database, and responding with JSON data. You can do this project right now, without any new lessons.

The secondary focus of this project is prepping your Capstone project so you have data ready to go and can dive into building a super badass UI instead of wasting a week in Node land. It’s not necessary that you find perfect data for your Capstone, but it’s vital that you know how to setup production APIs that are well tested. You can easily replace the source of your data, so don’t worry if you can’t come up with a good data source or if you have no idea what you want to build for the Capstone. Find or create interesting data that you might want to use in the future.

You can find the project guidelines [HERE](http://frontend.turing.io/projects/build-your-own-backend.html)



# Installation

Clone down this repo. [https://github.com/jjlljj/byob](https://github.com/jjlljj/byob)

To install the dependencies:

```
npm install
```

To fire up a development server:

```
npm start
```

Once the server is running, you can visit:

* localhost:3000

To Check the Lint files:

```js
npm run lint
```

---
# Endpoints available 

## GET Endpoints
- '/'
- '/api/v1/groups'
- '/api/v1/groups/:id'
- '/api/v1/years'
- '/api/v1/years/:id'

## DELETE endpoints

- '/api/v1/groups/:id'
- '/api/v1/years/:id'

## POST Endpoints

- '/api/v1/groups'
- '/api/v1/years/:id'

## PATCH Endpoints

- '/api/v1/groups/:id'
- '/api/v1/years/:id'

## AUTHORIZE

- '/authorize'
---

# Required Parameters

## Groups endpoints

### POST
 - { group, ethnicity, age, gender } must be included in the request body

### PATCH

- { group, gender, age, ethnicity } Must be included in the request body

## Years endpoints

### POST
- { year, group_id, unemployment_score } Must be included in request body

### PATCH
- { unemployment_score, year } Must be included in request body

## Authorize
- { app_name, email } Must be included in request body

---

# Sample responses from endpoints 

- homepage
<img width="1000" alt="screen shot 2018-03-30 at 9 03 51 am" src="https://user-images.githubusercontent.com/29507352/38142372-52eee9ae-33f9-11e8-9be1-66bc7ba29512.png">

- GET endpoint Groups

<img width="1000" alt="screen shot 2018-03-30 at 9 05 51 am" src="https://user-images.githubusercontent.com/29507352/38142447-9236d07c-33f9-11e8-8df6-7d06fcad4adb.png">

- GET Years

<img width="1000" alt="screen shot 2018-03-30 at 9 07 13 am" src="https://user-images.githubusercontent.com/29507352/38142494-c4b4abaa-33f9-11e8-9bc8-590778c0a913.png">

- AUTHORIZE response in HTML

<img width="1000" alt="screen shot 2018-03-30 at 9 09 06 am" src="https://user-images.githubusercontent.com/29507352/38142562-0aec17de-33fa-11e8-8a8f-006b1e76dec3.png">


