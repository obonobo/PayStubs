let envi = process.env;

/**
 * Database configuration information
 */
export const dbConfig = {
    db_port: envi.DB_PORT,
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
    listenPort: 3000,
    hostIP: '0.0.0.0'
}
