'use strict';

require('dotenv').config();

// NPM packages
const express = require('express');
// const superagent = require('superagent');
// const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');

// Dependencies
// const client = new pg.Client(process.env.something);
const app = express();
app.use(cors());
app.use(morgan("dev"));

// Connects server.js to ejs files
app.set('view engine', 'ejs');

// Allows us to get form POST
app.use(express.urlencoded({ extended: true }));

// static ensures everything stays the same
app.use(express.static('./public'));


// Runs whenever we have an error
app.use(errorHandler);
app.get('/', routeHandler);


app.get('/hello', (req, res) => {
  res.render('index');
});

// any route not found
app.use('*', notFoundHandler);


function routeHandler(req, res) {
  res.status(200).send('Route working')
}

// If the route is not found, this will run
function notFoundHandler(req, res) {
  res.status(404).send('404 Error: This is not the route you are looking for')
}

function errorHandler(error, req, res, next) {
  console.log(error);
  res.status(500).send('500 Fly you fools!');
}


app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));