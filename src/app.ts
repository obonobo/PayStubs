import express from 'express';
import { configure, getLogger, Logger } from 'log4js';
import mongoose from 'mongoose';
import { dirname } from "path";
import { realpathSync } from "fs";

import { appConfig, dbConfig } from './config';
import { hookShutdown } from './nodehooks';
import { PayStubSchema } from './schemas/PayStubschema';
import { IBMStubParser, testSample } from './StubParser';

// ** ==================== APP LOGIC ========================== **

// Logger information
configure(__dirname + '/../config/log4js.json');
const myLogger: Logger = getLogger();
myLogger.level = dbConfig.logLevel;

// Register some hooks on the node process
// This will close the database connection when Node is closed
hookShutdown(process, mongoose, myLogger);

/**
 * Saves to the database
 * @param data The data to be saved 
 */
const saveReq = function(data: Object): void{
    // Testing db connection
    myLogger.info('Attempting Database Connection...');

    // Grab a database connection
    mongoose.connect(dbConfig.db_URL, dbConfig.connectionOpts)
        .then(() => myLogger.info('Connection Successful!'))
        .catch(err => {
            let msg: string = `Could not connect: ${err}`;
            throw new Error(msg);
        }).then(() => {
            myLogger.info('Attempting to save your data...');
        });

    // Make a new document
    let PayStub = mongoose.model('PayStub', PayStubSchema);
    let payStub = new PayStub(data);

    payStub.save()
        .then(val => myLogger.info(`Document saved! It's ID is: ${val._id}`))
        .catch(err => {
            let msg: string = `Failed to save document: ${err}`;
            throw new Error(msg);
        });
}

// ?? ==================== EXPRESS ========================== ??
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
app.post(appConfig.payStubsRoute, function(req, res) {
    myLogger.info(`A paystub request of type: "${req.get('Content-Type')}" has been received:\n`);
    myLogger.info(`It was sent from address: ${req.ip}`);
    myLogger.info(`Here is the paystub data:\n${req.body.stub}`);
    
    let myParser: IBMStubParser = new IBMStubParser(req.body.stub);
    let parsed = myParser.parse();

    // Attempt to save to the db
    try {
        myLogger.info(`ABOUT TO SAVE DATA`);
        saveReq(parsed);
    } catch (e) {
        myLogger.log(e);
    }

    myLogger.info(parsed);
    myLogger.info(`========== REQUEST SAVED ==============`);
    myLogger.info(`========== GIVE ME MOAR STUBS ==========`);
    res.status(200).send('Your paystub has been received and processed!');
});

app.listen(appConfig.listenPort, appConfig.hostIP, err => {
    if (err) {
        myLogger.error(`Something went wrong while listening: ${err}`);
        throw err;
    }
    myLogger.info(`========== Listening for PayStubs @ ` 
                + `http://${appConfig.hostIP}:${appConfig.listenPort}${appConfig.payStubsRoute}` 
                + ` ==========`);
});

// TODO ==================== TEST ==========================
const testAxios = function () {
    const axios = require('axios');
    const headers = { 'Content-Type': 'application/json' }
    axios.post(`http://localhost:${appConfig.listenPort}/paystub`, {
      stub: testSample
    }, { headers } ).then(val => {
        myLogger.info(`Here is your response: "${val}".`);
    }).catch(err => {
        myLogger.error(`${err}`);
    });
}
// testAxios();
