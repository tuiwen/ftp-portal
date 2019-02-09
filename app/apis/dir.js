'use strict';

const Router = require('koa-router');

const router = new Router({prefix: 'dir'});

// List files in a directory
router.get('/', async ctx => {
  const {dir} = ctx.query;

  try {
    const list = await ctx.ftp.list(dir || '/');
    ctx.body = list;
  } catch (error) {
    ctx.throw(400, error);
  }
});

module.exports = router;
