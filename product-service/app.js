const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const router = require('./routes');
const helper = require('../response-helpers/response');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(helper);
app.use('/srv', router);

module.exports = app;
