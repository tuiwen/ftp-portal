'use strict';

const request = require('supertest');
const app = require('../app');

describe('ping', async () => {
  test('should return the server up-time; no authentication is required', async () => {
    const response = await request(app.callback()).get('/ping');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.uptime).toBeDefined();
  });
});
