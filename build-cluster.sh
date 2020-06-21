#!/bin/bash
# Builds the PVs, PVCs, services, and deployments in the microk8s cluster

# Gotta be in PayStubs directory
if [[ ! $(pwd) =~ PayStubs$ ]] || [[ ! $EUID -eq 0 ]]; then
    echo "Sorry bud, you need to be 'PayStubs' dir"
    echo "You also need to run as root"
    exit 1
fi

# Must have defined mongo-user-pass secret with kubectl
if ! microk8s.kubectl get secret mongo-user-pass; then
    echo "Please define mongo-user-pass with kubectl"
    exit 1
fi 

# Check that node-typescript is installed 
REQUIRED_PKG="node-typescript"
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $REQUIRED_PKG|grep "install ok installed")
echo Checking for $REQUIRED_PKG: $PKG_OK
if [ "" = "$PKG_OK" ]; then
  echo "No $REQUIRED_PKG. Setting up $REQUIRED_PKG."
  apt-get -y install $REQUIRED_PKG 
fi

# Build the project
npm install
tsc

# Create the namespace
microk8s.kubectl create namespace utils-dev

# Import images to microk8s containerd registry
docker build -t utils/paystubs:v1.1 -f paystubs.dockerfile .
docker save utils/paystubs:v1.1 > paystubs_v1.1.tar
microk8s.ctr image import paystubs_v1.1.tar
docker pull mongo
docker tag mongo utils/mongo:v1
docker save utils/mongo:v1 > mongo_v1.tar
microk8s.ctr image import mongo_v1.tar
rm -f paystubs_v1.1.tar mongo_v1.tar

# PersistentVolume (PV)
mkdir data -m 777
microk8s.kubectl apply -f paystubs-pv.yml

# PersistentVolumeClaim (PVC)
microk8s.kubectl apply -f paystubs-pv-claim.yml

# Services
microk8s.kubectl apply -f mongodb/mongo-service.yml
microk8s.kubectl apply -f paystubs-service.yml

# Deployments
microk8s.kubectl apply -f paystubs-deployment.yml
microk8s.kubectl apply -f mongodb/mongo-deployment.yml
