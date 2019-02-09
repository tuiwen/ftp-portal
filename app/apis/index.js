'use strict';

const fs = require('fs');
const path = require('path');
const PromiseFtp = require('promise-ftp');
const auth = require('basic-auth');
const Router = require('koa-router');

const router = new Router();

// Authentication
router.use(async (ctx, next) => {
  const credentials = auth(ctx.req);
  const {host, port} = ctx.query;
  if (credentials && host && port) {
    try {
      const ftp = new PromiseFtp();
      await ftp.connect({host, port, user: credentials.name, password: credentials.pass});
      ctx.ftp = ftp;
      await next();
      ftp.end();
    } catch (error) {
      if (ctx.ftp) {
        ctx.ftp.end();
      }

      ctx.throw(error.status || 400, error.message || 'Bad request.');
    }
  } else {
    ctx.set('WWW-Authenticate', 'Basic');
    ctx.status = 401;
    ctx.body = 'Unauthorized access.';
  }
});

fs.readdirSync(path.join(__dirname, '/')).forEach(file => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const r = require('./' + file.substring(0, file.lastIndexOf('.')));
    router.use('/', r.routes(), r.allowedMethods());
  }
});

module.exports = router;
