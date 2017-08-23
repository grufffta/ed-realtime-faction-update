const http = require('http')
const levelup = require('levelup')
const leveldown = require('leveldown')
const Gun = require('gun/gun')
require('gun/lib/ws')
require('gun/nts')
require('gun-level')

const levelDB = levelup('./data', { db: leveldown })
var server = http.createServer(function(req,res) {
if(Gun.serve(req, res)){ return } // filters gun requests!
	require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error',function(){ // static files!
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(require('fs')
			.readFileSync(require('path')
			.join(__dirname, 'index.html') // or default to index
		));
	}).pipe(res);
})

var gun = Gun({
    peers: {'http://peer.1.apily.co.uk:3272/gun':{}, 'http://peer.2.apily.co.uk:3272/gun':{}},
    db: levelDB,    
    web: server
})
gun.on('out', {get: {'#': {'*': ''}}})
server.listen(3272)   
console.log('server listening')
