# PayStubs
Web service to process IBM paystubs



## Mongodb Configuration
There is a mondod.config file located in config dir. You will need to run the mongodb Docker container passing it this file.

Below is the docker command that I use for setting up MongoDB in this project:

```sudo docker run -v /home/ethan/mongodata:/data/db -v /git/PayStubs/etc:/etc/mongo --name mongo1 -d mongo```
