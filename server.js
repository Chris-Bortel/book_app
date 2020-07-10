'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan("dev"));

// Allows us to get form POST
app.use(express.urlencoded({ extended: true }));

// connects server.js to e
app.use(express.static('./view'))

app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));



