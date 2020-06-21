let envi = process.env;

/**
 * Database configuration information
 */
export const dbConfig = {
    db_port: parseInt(envi.DB_PORT),
    db_URL : `mongodb://${envi.DB_IP}:${envi.DB_PORT}/${envi.DB_NAME}?authSource=admin`,
    connectionOpts: {
        useNewUrlParser: true, useUnifiedTopology: true,
        keepAlive: true, connectTimeoutMS: 10000,
        user: envi.DB_USER, pass: envi.DB_PASS
    },
    logLevel: envi.LOG_LEVEL
}

/**
 * App configuration information
 */
export const appConfig = {
    listenPort: parseInt(envi.PAYSTUBS_PORT), // 3000 recommended 
    hostIP: envi.PAYSTUBS_IP, // '127.0.0.1' recommended
    payStubsRoute: envi.PAYSTUBS_ROUTE // '/paystub/' recommended
}
