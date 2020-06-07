# PayStubs
Web service to process IBM paystubs

## Mongodb Configuration
There is a mondod.config file located in config dir. You will need to run the mongodb Docker container passing it this file.

Below is the docker command that I use for connecting to an existing MongoDB in this project:

```sudo docker run -v /home/ethan/mongodata:/data -p 33333:27017 --name mongo1 -d mongo --auth```

The --auth at the end tells mongod that we want to enable authentication on our database.

To authenticate with the database, we can place our credentials in the connection string, or use the database command (not the real credentials):

```
db.auth({user: "mongoadmin", pwd: "Admin123!"})
```

In a mongodb connection string:

```mongodb://mongoadmin:Admin123!@laptop1.local:33333```

To set up a new database, we can do the following:

```
sudo docker run -e MONGO_INITDB_ROOT_USERNAME="mongoadmin" -e MONGO_INITDB_ROOT_PASSWORD="Admin123!" -v /home/ethan/mongodata:/data -p 33333:27017 --name mongo1 -d mongo --auth
```

## Database Schema
In Mongodb data is organized like so: database > collection > record (BSON)

The schema that I am thinking about is:
