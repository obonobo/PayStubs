import log4js, { Logger, getLogger } from 'log4js';

/**
 * An N Logger logs to an arbitrary number of files with each logging statement. 
 * We use this class to log to both std out and to file at the same time, but
 * it can be used for logging any number of files from 1 to N.  
 */
class NLogger {

    /**
     * Logger objects indexed by file path
     */
    loggers: {[k: string]: Logger};

    /**
     * By default NLogger will log to stdout, but you can specify any number of
     * additional logger for it to hold.
     * @param args filepaths for additional loggers
     */
    constructor(...args: string[]) {
        this.loggers = {};
        args.forEach((filePath: string) => {
            this.loggers[filePath] = getLogger();
        });
    }

    logN(level: LogLevel, ...args: string[]) {
        
    }
}
