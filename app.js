// Connexion à la BD

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sageindex', {
    useMongoClient: true,
    keepAlive: 30000,
    connectTimeoutMS: 30000,
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// Lancement du serveur web

const server = require('./lib/webserver').server;
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server started, go to http://localhost:${port}/`));
