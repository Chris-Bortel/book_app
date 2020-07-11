'use strict';

require('dotenv').config();

// NPM packages
const express = require('express');
// const superagent = require('superagent');
// const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');
// const { render } = require( 'ejs' );
const app = express();
// const client = new pg.Client(process.env.something);

// Express dependencies
app.use(cors());
app.use(morgan('dev'));

// EJS Connects server.js to views
app.set('view engine', 'ejs');

// Allows us to get form POST
app.use(express.urlencoded({ extended: true }));
// static ensures everything stays the same
app.use(express.static('./public'));

//////////////////////////////////////////////////
////// Routes  // These
//////////////////////////////////////////////////
app.get('/', handleHomePage);
app.get('/searches/new', handleNewSearches); // 304 error
app.post('/searches', handleGoogleAPI);


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

// Gets input data
function handleNewSearches(req,res) {
  res.status(200).render('pages/searches/new'); // actual file path
}

// Renders API data
function handleGoogleAPI(req, res) {
  const API = 'https://www.googleapis.com/books/v1/volumes?q=boobs';
  let queryObjeect = {
    q: intitle, inauthor,
  }

  superagent
    .get(API)
    .query(queryObject)
    .then(data => {
      let results = data.body.items.map(result => {
        console.log(results);
        return new Books()

      })
      
    })
  
  res.status(200).render('pages/searches/show');

}


/////////////// Constructor function
function Books(obj) {
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors;
  this.description = obj.volumeInfo.description;
  this.image_url = obj.volumeInfo.imageLinks;
}
///////////// Error Handlers

function handleNotFound(req, res) {
  res.status(404).send('404 Error: This is not the route you are looking for');
}

function handleError(error, req, res, next) {
  console.log(error);
  res.status(500).send('500 Fly you fools!');
}



