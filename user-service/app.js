const express = require('express');
const logger = require('morgan');
const helper = require('../response-helpers/response');

require('dotenv').config();
const router = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(helper);


app.use('/srv', router);

module.exports = app;
