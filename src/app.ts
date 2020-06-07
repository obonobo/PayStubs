import express from 'express';
import { getLogger, Logger } from 'log4js';
import mongoose from 'mongoose';

import { dbConfig, appConfig } from './config';
import exampleData from './extra/ExamplePaystub';
import { PayStubSchema } from './schemas/PayStubschema';

// Logger information
const myLogger: Logger = getLogger();
myLogger.level = dbConfig.logLevel;

// App information
const app = express();

/**
 * Saves to the database
 */
function saveReq(): void {
    // Testing db connection
    myLogger.info('Attempting Database Connection...');

    // Grab a database connection
    mongoose.connect(dbConfig.db_URL, dbConfig.connectionOpts)
        .then(conn => myLogger.info('Connection Successful!'))
        .catch(err => {
            myLogger.error(`Could not connect: ${err}`);
            process.exit(1);
        }).then(() => {
            myLogger.info('Attempting to save your data...');
        });

    // Make a new document
    let PayStub = mongoose.model('PayStub', PayStubSchema);
    let payStub = new PayStub(exampleData);

    payStub.save()
        .then(val => myLogger.info(`Document saved! It's ID is: ${val._id}`))
        .catch(err => {
            myLogger.error(`Failed to save document: ${err}`);
            process.exit(1);
        }).finally(() => {
            mongoose.disconnect();
        });
}

// TODO ==================== EXPRESS ==========================
/**
 * One and only route for this app
 */
app.get('/', function (req, res) {
    res.send('Hello, World!');
});

/**
 * 
 */
app.listen(appConfig.listenPort, () => {
    myLogger.info(`PayStubs listening on port ${appConfig.listenPort}!`);
});
