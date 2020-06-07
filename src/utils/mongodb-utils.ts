import mongoose, { Connection } from "mongoose";
import { Logger } from "log4js";
import {PayStubSchema} from '../schemas/PayStubschema';
import { dbConfig } from '../config';

/**
 * Connect to the database
 * @returns A connection object to your database
 */
export function getDbConn(logger: Logger): Connection {
    logger.debug('GETTING DB CONNECTION...')

    // Create the connection 
    let ret: Connection = null;
    const conn = mongoose.createConnection(dbConfig.db_URL, {
        useNewUrlParser: true, useUnifiedTopology: true,
        keepAlive: true, reconnectInterval: 500,
        connectTimeoutMS: 10000,
        user: dbConfig.connectionOpts.user, pass: dbConfig.connectionOpts.pass
    });
    conn.catch(err => {
        logger.error('Oops! Unable to connect...');
        logger.error(`Received the following error:\n${err}`);
        ret = null;
    });

    conn.on('error', err => {
        logger.error('Oops! Unable to connect...');
        logger.error(`Received the following error:\n${err}`);
        ret = null;
    });
    conn.on('connected', () => {
        logger.info('Connection Successful!');
        ret = conn;
    });

    // Add a model to our connection
    conn.model('PayStub', PayStubSchema);

    // Pass our connection to caller
    return ret;
};
