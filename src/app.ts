import { Connection } from 'mongoose';
import express from 'express';
import getDbConn from './utils/mongodb-utils';
import { Logger } from 'logger';

// Host information
const hostAllInterfaces: string = '0.0.0.0';
const localHost: string = '127.0.0.1';
const port: number = 3000;

// Logger information
const logger: Logger = new Logger();
const logToFile: Logger = new Logger('development.log');

// App information
const app = express();
const dbConn: Connection = getDbConn();

/**
 * 
 */
app.get('/', function (req, res) {

  res.send('Hello, World!');
});

/**
 * 
 */
app.listen(port, () => {
  console.log(`PayStubs listening on port 3000!`);
});
