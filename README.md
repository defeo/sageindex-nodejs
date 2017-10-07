# SageIndex Node.js demo

## Dependencies

- Node.js (a decently recent version)
- MongodB

## Install

Cd in the directory, then run

	npm install

## Run

Start a local Mongo instance with

	npm run local-db

Start the web app with

	npm start

Visit <http://localhost:8080/>. Enjoy


## Todo

- Use RabbitMQ to offload taks, such as fetch, to other processes.
- Integrate user auth (passport module).
- Add full text search.
- Find a good frontend framework for the client (possibly with WebSocket integration).
