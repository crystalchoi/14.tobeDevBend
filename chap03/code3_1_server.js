const http = require('http');
const server = http.createServer((req, res) => {
	res.setHeader("Content-Type", "text/plain");
	res.end("OK")
})

server.listen("8000", () => {
	console.log("Server listening on 8000");
})
