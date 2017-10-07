const request = require('request-promise-native');
const cheerio = require('cheerio');

exports.html = function(url) {
    return request({ uri: url, transform: (body) => cheerio.load(body) })
	.then((doc) => ({
	    doc: doc,
	    title: doc('title').text(),
	    desc: doc('meta[name="description"]').attr('content'),
	}));
}
