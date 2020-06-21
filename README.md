### PayStubs

The PayStubs project is my first foray into microservices. It is a Nodejs service that receives
work paystubs, parses them, and stores the data in a MongoDB database which can then be accessesed
via Microsoft Excel, or data visualization software. I wrote this as a side project while working
at IBM for my first Co-op internship and I used it personally for recording my pay that I earned
throughout my workterm. I will probably improve upon the project and continue using it for paystubs
from other employers as part of my personal accounting.

The idea behind this was to dip my toes into Node, Expressjs, MongoDB, Docker, and finally wrapping
it all up by deploying the app on Ubuntu:20.04 with Kubernetes.

I learned a lot doing this project, and will use what I learned here to do my next project: DriveFlix.

The app is written in TypeScript, and I made an accompanying Google AppScript client that sits on 
your Gmail account and sends paystubs received by email to the Kubernetes cluster with PayStubs app. 

The architecture is simple - the app is stateless, scaling horizontally by increasing the ReplicaSet 
of the Kubernetes deployment. It is connected to a mongodb server that runs as a seperate service, 
which I connect to on my pc using Excel or MongoDB Compass. PayStubs is exposed with a Kubernetes NodePort 
Service, which performs load-balancing and directing of traffic to the Pods. 
