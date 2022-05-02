const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorHelpers = require('../response-helper/response');

const indexRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(errorHelpers);

app.use('/api/v1', indexRouter);

module.exports = app;
