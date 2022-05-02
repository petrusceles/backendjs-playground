const express = require('express');
const logger = require('morgan');
const helper = require('../response-helpers/response');

const router = require('./routes');

const app = express();
require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(helper);


app.use('/api/v1', router);

module.exports = app;
