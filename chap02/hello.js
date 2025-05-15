const http = require("http");

let count = 0;

const server = http.createServer((req, res) => {
	log(count);
	res.status = 200;
	// res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Content-Type", "text/plain");
	// res.write("Hello world!");
	res.write(JSON.stringify(count));
	setTimeout(() => {
		res.end('Hello world!');
		}, 2000);
})


function log(count) {
	console.log((count += 1)); // ❷
}

server.listen(8000, () => console.log('listening on port 8080'));
