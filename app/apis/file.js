'use strict';

const Router = require('koa-router');

const router = new Router({prefix: 'file'});

// Download a file
router.get('/', async ctx => {
  const {remote} = ctx.query;

  try {
    ctx.status = 200;
    await ctx.ftp.get(remote).then(stream => {
      return new Promise((resolve, reject) => {
        stream.once('close', resolve);
        stream.once('error', reject);
        stream.pipe(ctx.res, {end: false});
      });
    });
    ctx.res.end();
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Upload a file
router.post('/', async ctx => {
  const {file, remote} = ctx.body;

  try {
    await ctx.ftp.put(file, remote);
    ctx.body = null;
  } catch (error) {
    ctx.throw(400, error);
  }
});

// Delete a file
router.delete('/', async ctx => {
  const {remote} = ctx.query;

  try {
    await ctx.ftp.delete(remote);
    ctx.body = null;
  } catch (error) {
    ctx.throw(400, error);
  }
});

module.exports = router;
