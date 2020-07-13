'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

////// Routes  // These
app.get('/', handleHomePage);
app.get('/searches/new', handleNewSearches); // 304 error
app.post('/searches', handleGoogleAPI);
app.get('/books/:id', handleBooksDetails);
app.use('*', handleNotFound); // any route not found
// app.use('/error', handleError);

////// Route Handlers
function handleHomePage(req, res) {
  let SQL = 'SELECT * FROM booksNOPE';

  client.query(SQL).then((results) => {
    console.log('RESLUTS FORM DB++++++++++++', results);
    let dbResultArr = results.rows;
    let rowAmount = results.rowCount;
    res.render('pages/index', { array: dbResultArr, rows: rowAmount });
  })
    .catch(error => handleError(error, res));
}

function handleNewSearches(req, res) {
  res.status(200).render('pages/searches/new'); // actual file path
}

function handleGoogleAPI(req, res) {
  const API = 'https://www.googleapis.com/books/v1/volumes';
  let queryObject = {
    q: `${req.body.searchField}:${req.body.radiobutton}`,
  };
  superagent
    .get(API)
    .query(queryObject)
    .then((data) => {
      let bookResults = data.body.items.map((result) => new Books(result));
      res.render('./pages/searches/show', { data: bookResults });
    });
}

function handleBooksDetails(req, res) {
  res.render('pages/books/show');
}

function Books(obj) {
  this.title = obj.volumeInfo.title;
  this.author = obj.volumeInfo.authors;
  this.description = obj.volumeInfo.description;
  this.image_url = obj.volumeInfo.imageLinks.thumbnail
    ? obj.volumeInfo.imageLinks.thumbnail
    : 'https://i.imgur.com/J5LVHEL.jpg';
  this.isbn =
    obj.volumeInfo.industryIdentifiers[0].identifier || 'ISBN not found';
}

///////////// Error Handlers
function handleNotFound(req, res) {
  res.status(404).send('404 Error: This is not the route you are looking for');
}

function handleError(error, res) {
  console.log('this is an error++++++++', error);
  res.render('pages/error', { error: 'There is an error'});
}

client.connect(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}.`);
  });
});
