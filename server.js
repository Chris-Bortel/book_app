'use strict';

require('dotenv').config();

// NPM packages
const express = require('express');
// const superagent = require('superagent');
// const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
// const client = new pg.Client(process.env.something);

app.use(cors());
app.use(morgan('dev'));
// EJS Connects server.js to views
app.set('view engine', 'ejs'); 
// Allows us to get form POST
app.use(express.urlencoded({ extended: true }));
// static ensures everything stays the same
app.use(express.static('./public'));

//////////////////////////////////////////////////
////// Routes
//////////////////////////////////////////////////
app.get('/', handleHomePage);
app.get('/searches/new', handleNewSearches); // 304 error



app.use('*', handleNotFound); // any route not found
app.use(handleError);


//////////////////////////////////////////////////
////// Start Server
//////////////////////////////////////////////////

app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));


//////////////////////////////////////////////////
////// Route Handlers
//////////////////////////////////////////////////
function handleHomePage(req, res) {
  res.status(200).render('index');
}

function handleNewSearches(req,res) {
  res.render('pages/searches/new');
}
















function handleNotFound(req, res) {
  res.status(404).send('404 Error: This is not the route you are looking for');
}

function handleError(error, req, res, next) {
  console.log(error);
  res.status(500).send('500 Fly you fools!');
}



