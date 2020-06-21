FROM ubuntu

RUN apt-get update && apt-get install -y nodejs nano curl

RUN mkdir /PayStubs

COPY node_modules /PayStubs/node_modules
COPY dist         /PayStubs/dist
COPY config       /PayStubs/config
