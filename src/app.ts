import express from 'express';
import { configure, getLogger, Logger } from 'log4js';
import mongoose from 'mongoose';

import { appConfig, dbConfig } from './config';
import { exampleData } from './extra/ExamplePaystub';
import { hookShutdown } from './nodehooks';
import { PayStubSchema } from './schemas/PayStubschema';
import { IBMStubParser, testSample } from './StubParser';

// Logger information
configure('./config/log4js.json');
const myLogger: Logger = getLogger();
myLogger.level = dbConfig.logLevel;

// Register some hooks on the node process
hookShutdown(process, mongoose, myLogger);

/**
 * Saves to the database
 */
const saveReq = function(): void {
    // Testing db connection
    myLogger.info('Attempting Database Connection...');

    // Grab a database connection
    mongoose.connect(dbConfig.db_URL, dbConfig.connectionOpts)
        .then(() => myLogger.info('Connection Successful!'))
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
        });
}

// TODO ==================== EXPRESS ==========================
// App information
const app = express();

// This tells express to use a middleware for
// parsing the requests 
app.use(express.json());

// Test route 
app.get('/', function (req, res) {
    res.send('Hello, World!');
});

// This route handles paystub 
app.post('/paystub', function(req, res) {
    myLogger.info(`A paystub request of type: "${req.get('Content-Type')}" has been received:\n`);
    myLogger.info(`It was sent from address: ${req.ip}`);
    myLogger.info(`Here is the paystub data:\n${req.body.stub}`);
    
    let myParser: IBMStubParser = new IBMStubParser(req.body.stub);
    let parsed = myParser.parse();

    myLogger.info(parsed);
    res.json({ parsed: parsed });
});

app.listen(appConfig.listenPort, err => {
    if (err) {
        myLogger.error(`Something went wrong while listening: ${err}`);
        throw err;
    }
    myLogger.info(`PayStubs listening @ http://${appConfig.hostIP}:${appConfig.listenPort}`);
});

// TODO ==================== TEST ==========================
const testAxios = function () {
    const axios = require('axios');
    const headers = { 'Content-Type': 'application/json' }
    const res = axios.post('http://localhost:3000/paystub', {
      stub: testSample
    }, { headers } ).then(val => {
        myLogger.info(`Here is your response: "${val.data.stub}".`);
    }).catch(err => {
        myLogger.error(`${err}`);
    });
}

testAxios();
