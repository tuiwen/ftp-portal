'use strict';

const request = require('supertest');

const app = require('../app');
const server = require('./ftp-server');

beforeAll(async () => {
  await server.startFtpServer(8001);
});

describe('dir', async () => {
  test('should return 401 error due to lack of authentication', async () => {
    const response = await request(app.callback()).get('/dir?host=127.0.0.1&port=8001');
    expect(response.status).toEqual(401);
  });
  test('should return 200 with valid authentication', async () => {
    const response = await request(app.callback())
      .get('/dir?host=127.0.0.1&port=8001')
      .auth('ftpTestUser', 'ftpTestPassword');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(Array.isArray(response.body)).toEqual(true);
  });
});
