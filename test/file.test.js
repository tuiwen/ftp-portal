'use strict';

const fs = require('fs');
const request = require('supertest');

const app = require('../app');
const server = require('./ftp-server');

beforeAll(async () => {
  await server.startFtpServer(8002);
});

describe('file', async () => {
  test('should download a small file successfully', async () => {
    const response = await request(app.callback())
      .get('/file?host=127.0.0.1&port=8002&remote=/test/small_text_file_for_download_testing.txt')
      .auth('ftpTestUser', 'ftpTestPassword')
      .set('Accept', 'application/octet-stream');

    const fileContent = fs.readFileSync('./test/small_text_file_for_download_testing.txt', 'utf8');

    expect(response.status).toEqual(200);
    expect(response.text).toEqual(fileContent);
  });
  test.todo('download large files');
  test.todo('upload files');
  test.todo('delete files');
});
