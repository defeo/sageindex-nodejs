// I hate JQuery, and I am too lazy to use a JS client framework here,
// so I will do in pure JS
let $ = document.querySelector.bind(document);

let ws = new WebSocket((window.location.protocol == 'http:'
			? 'ws://'
			: 'wss://'
		       ) + window.location.host);
// little helper
ws.sendJSON = (data) => ws.send(JSON.stringify(data));

// When the URL field is filled
$('#url').addEventListener('change', (e) => {
    if (e.target.value && !e.target.validity.typeMismatch) {
	let data = {
	    event: 'url',
	    data: e.target.value,
	};
	ws.sendJSON(data);
	$('#loading').classList.add('loading');
    } else {
	$('#loading').classList.remove('loading');
    }
});

// When the user clicks the button
$('#add').addEventListener('click', (e) => {
    ws.sendJSON({
	event: 'add_doc',
	url: $('#url').value,
	title: $('#title').value,
	desc: $('#description').value,
    });
});

// When the server sends back a message
ws.addEventListener('message', (e) => {
    let data = JSON.parse(e.data);
    console.log(data);
    switch (data.event) {
    case 'fetch_text':
	$('#loading').classList.remove('loading');
	$('#moreinfo').classList.add('fill');
	$('#title').value = data.title || '';
	$('#description').value = data.desc || '';
	break;
    case 'doc_added':
	window.location = data.data;
    }
});
