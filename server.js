'use strict';

const PORT = process.env.PORT;
require('dotenv').config();

// NPM packages
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

// Express dependencies
app.use(cors());
app.use(morgan('dev'));

// Allows us to get form POST
app.use(express.urlencoded({ extended: true }));

// gives us a public folder
app.use(express.static('./public'));

// EJS Connects server.js to views
app.set('view engine', 'ejs');


// TODO: I think that this is why the db is not regeris TODO: GETTING   LISTENING on port undefined
// TODO: do we need a SELECT statement?
client.connect(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}.`);
  });
});


////// Routes  // These
app.get('/', handleHomePage);
app.get('/searches/new', handleNewSearches); // 304 error
app.post('/searches', handleGoogleAPI);

app.use('*', handleNotFound); // any route not found
app.use(handleError);


////// Start Server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));


////// Route Handlers
function handleHomePage(req, res) {
  res.status(200).render('index');
}


// Gets input data
function handleNewSearches(req,res) {
  res.status(200).render('pages/searches/new'); // actual file path
}


// Renders API data
function handleGoogleAPI(req, res) {
  const API = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = {
    q: `${req.body.title_author}:${req.body.search_query}`
  };
  console.log(res);

  superagent.get(API).query(queryObject).then(data => {
    console.log(queryObject);
    let bookResults = data.body.items.map(result => {
      return new Books(result);

    });

    console.log(bookResults);
    res.status(200).render('pages/searches/show', { data: bookResults });
  });

}


/////////////// Constructor function
function Books(obj) {

  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors;
  this.description = obj.volumeInfo.description;
  this.image_url = obj.volumeInfo.imageLinks.thumbnail ? obj.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}


///////////// Error Handlers
function handleNotFound(req, res) {
  res.status(404).send('404 Error: This is not the route you are looking for');
}

function handleError(error, req, res, next) {
  console.log(error);
  res.status(500).send('500 Fly you fools!');
}

// TODO: need to make a handler that will render the error file



