const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const fetch = require('./fetch');
const models = require('./models');

// Serveur Web

const app = exports.app = express();
app
    .set('view engine', 'pug')
    .use('/public', express.static('public'));

app.get('/', (req, res) => models.Doc.find()
	.lean().exec()
	.then((docs) => res.render('index', { docs: docs }))
	.catch((err) => {
	    console.error(err);
	    res.status(500).send('Internal error');
	})
       );

app.get('/new', (req, res) => res.render('new'));

app.get('/doc/:doc', (req, res) => models.Doc.findById(req.params.doc)
	.lean().exec()
	.then((doc) => doc === null
	      ? res.status(404).send('Not Found')
	      : res.render('doc', { doc: doc }))
	.catch((err) => {
	    console.error(err);
	    res.status(500).send('Internal error')
	})
       );

const server = exports.server = http.createServer(app);

// Serveur WebSockets

const wss = exports.wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws, req) => {
    // Little helper
    ws.sendJSON = (data) => ws.send(JSON.stringify(data));
    
    ws.on('message', (msg) => {
	console.log(msg);
	let data = JSON.parse(msg);
	switch (data.event) {
	case 'url':
	    // Normally, we would enque a task for RabbitMQ,
	    // that will do a fetch and give the content back
	    // to us.
	    // Bot for the moment we are too lazy and we do
	    // the getch (asynchronously) in the same thread.
	    fetch.html(data.data)
		.then((doc) => ws.sendJSON({
		    event: 'fetch_text',
		    title: doc.title,
		    desc: doc.desc,
		}))
		.catch((err) => {
		    ws.sendJSON({
			event: 'error',
			msg: 'Something bad happened',
		    });
		    console.log(err);
		});
	    break;
	case 'add_doc':
	    models.Doc.create({
		url: data.url,
		title: data.title,
		description: data.desc,
	    }).then((doc) => ws.sendJSON({
		event: 'doc_added',
		data: '/doc/' + doc._id,
	    })).catch((err) => {
		ws.sendJSON({
		    event: 'error',
		    msg: 'Something bad happened',
		});
		console.log(err);
	    });
	    break;
	}
    });
});
