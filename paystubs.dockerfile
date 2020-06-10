FROM ubuntu

ARG USER
ARG PASS
ARG IP='192.168.2.50' 
ARG PORT='33333' 
ARG NAME='paystubs'
ARG LOGLEVEL='debug'

ENV key=value

RUN apt update && apt install -y nodejs

RUN mkdir /PayStubs

COPY node_modules /PayStubs/node_modules
COPY dist         /PayStubs/dist
COPY config       /PayStubs/config

# Below is incorrect, we will need to set up an entrypoint script
CMD DB_USER=${USER} DB_PASS=${PASS} DB_IP=${IP} DB_PORT=${PORT} DB_NAME=${NAME} LOG_LEVEL=${LOGLEVEL} node /PayStubs/dist/app.js