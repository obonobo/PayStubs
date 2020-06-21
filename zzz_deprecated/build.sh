
if [ $EUID -ne 0 ]; then 
    echo 'This script must be run as root...'
    exit 1
fi


if [ -z $1 ] || [ -z $2 ]; then 
    echo 'You need to pass MongoDB username and password for the app to connect:'
    echo '      ./build.sh <username> <password>'
    exit 1
fi

# Builds a docker image for PayStubs
main() {
    echo 'Removing running containers...'
    docker rm --force ppp

    echo 'Running npm install...'
    npm install
    
    # Compile typscript
    echo 'Transpiling JS...'
    ./node_modules/typescript/bin/tsc

    # Builds the docker container
    buildPayStubsContainer $1 $2
}

buildPayStubsContainer() {
    echo 'Building docker image...'
    docker build -t paystubs -f paystubs.dockerfile --build-arg USER=$1 --build-arg PASS=$2 .

    echo 'Running docker image...'
    docker run -d --name ppp -p 3000:3000 paystubs
}

main $1 $2
