'use strict';

const FtpServer = require('ftp-srv');

const startFtpServer = async port => {
  const server = new FtpServer({url: `ftp://127.0.0.1:${port}`});
  const ftpUser = 'ftpTestUser';
  const ftpPassword = 'ftpTestPassword';

  server.on('login', ({connection, username, password}, resolve, reject) => {
    if (username === ftpUser && password === ftpPassword) {
      // Add a handler to confirm file uploads
      connection.on('STOR', (error, fileName) => {
        if (error) {
          console.error(`FTP server error: could not receive file ${fileName} for upload ${error}`);
        }

        console.info(`FTP server: upload successfully received - ${fileName}`);
      });

      // Add a handler for file download
      connection.on('RETR', (error, filePath) => {
        if (error) {
          console.error(`FTP server error: could not download file ${filePath}`);
          console.error(error);
        } else {
          console.info(`FTP server: download succeeded - ${filePath}`);
        }
      });

      resolve();
    } else {
      reject(new Error('Invalid authentication'));
    }
  });

  server.on('client-error', ({context, error}) => {
    console.error(`FTP server error: error interfacing with client ${context} ${error} ${JSON.stringify(error)}`);
  });

  await server.listen();
  console.log('The ftp server is up.');

  return server;
};

module.exports = {startFtpServer};
