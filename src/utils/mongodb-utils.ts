import mongoose, { Connection } from "mongoose";

// Credentials and authentication mechanism
let user: string = encodeURIComponent('mongoadmin');
let pass: string = encodeURIComponent('Admin123!');
let connectionURL: string = `mongodb://${user}:${pass}@laptop1.local:33333/paystubs`;

/**
 * Connect to the database
 * @returns A connection object to your database.
 */
const getDbConn: Function = function(): Connection {
  
  // Create the connection 
  const conn: Connection = mongoose.createConnection(connectionURL, {useNewUrlParser: true});

  // Add a model to our connection
  conn.model('PayStub', require('../schemas/paystubschema'));

  // Pass our connection to caller
  return conn;
};

export default getDbConn;
