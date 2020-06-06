/**
 * file used to interface with the mongodb
 */
const MongoClient = require('mongodb').MongoClient;

// Credentials and authentication mechanism
const user = encodeURIComponent('mongoadmin');
const pass = encodeURIComponent('Admin123!');

// The connection URL used to reach the database
const connectionURL = `mongodb://${user}:${pass}@laptop1.local:33333/paystubs`;

// A MongoClient object
const client = new MongoClient(connectionURL, { autoReconnect: true });

/**
 * Creates the paystubs database, if it doesnt already exist
 * We create the function as a constant here but you dont need
 * to do that.
 */
const initializePaystubsDB = () => {

  /**
   * Finally to connect to the server, we use the connect method of the mongoclient
   */
  client.connect(connectionURL, (err, db) => {
    if (err) throw err;
    console.log("Database Created!");
    db.close();
  });
}

/***
 * Creates a collection in the PayStubs database
 * @param name The name of your collection
 */
const createCollection = (name) => {
  if (typeof name !== "string") throw new Error("Collection name must be a string");

  client.connect(connectionURL, (err, db) => {
    if (err) throw err;
    console.log("Database Connected!");
    db.createCollection(name);
    db.close();
  });
};

/***
 * Adds a record to the database.
 * Records should be of a JSON matching the schema format.
 */
const addRecord = (record) => {
  
  
  MongoClient.connect(connectionURL, (err, db) => {
    if (err) throw err;

  });
};

const recordTemplate = {

};

/***
 * This is how you make a module in Node.js
 * You simply specify what parts of the file you would like to export. 
 */
module.exports = {
  initPayStubsDB: initializePaystubsDB
};

/**
 * The alternative way is to use the exports object directly
 * NOTE: the exports object and the module.exports object are the same thing
 */
// exports.myFunc = () => 1;

