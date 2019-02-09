'use strict';

const path = require('path');
const debug = require('debug')('dev');
const Koa = require('koa');
const favicon = require('koa-favicon');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {oas} = require('koa-oas3');

const api = require('./apis');

const app = new Koa();

// FTP instance in context
app.context.ftp = null;

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = error.message || 'Internal Server Error';
    ctx.app.emit('error', error, ctx);
  }
});
app.on('error', (error, ctx) => {
  /* Centralized error handling:
   *   console.log error
   *   write error to log file
   *   save error and request information to database
   *   ...
   */
  debug(ctx);
  debug(error);
});

// Serve static favicon
app.use(favicon(path.join(__dirname, './public/favicon.ico')));

// A ping service that returns the server up-time
const ping = new Router();
ping.get('/ping', async ctx => {
  ctx.body = {uptime: process.uptime()};
});
app.use(ping.routes()).use(ping.allowedMethods());

// Parse queries and data
app.use(bodyParser());

// OpenApiSpecification Interface
app.use(oas({
  file: path.join(__dirname, '../openapi.yaml'),
  endpoint: '/openapi.json',
  uiEndpoint: '/'
}));

// Apis
app.use(api.routes()).use(api.allowedMethods());

module.exports = app;
