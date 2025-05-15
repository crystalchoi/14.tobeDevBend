const http = require('http');
const url = require('url')
const server = http.createServer((req, res) => {
	const path = url.parse(req.url, true).pathname;
	res.setHeader("Content-Type", "text/html; charset=utf-8");


	if (path in urlMap) {
		urlMap[path](req, res)
	} else {
		notFound(req, res);
	}
	// if (path === "/user") {
	// 	user(req, res);
	// } else if (path === "/feed") {
	// 	feed(req, path, res);
	// } else {
	// 	notFound(req, res);
	// }

})


server.listen("8000", (req, res) => {
	console.log("Server listening on 8000");
})


const user = (req, res) => {
	const userInfo = url.parse(req.url, true).query;
	res.end(`[user] name: ${userInfo.name}, age: ${userInfo.age}`);
}
const feed = (req, path, res) => {
	res.end(`<ul>${path}<li>picture1</li><li>picture2</li><li>picture3</li></ul>`);
}
const notFound = (req, res) => {
	res.statusCode = 400;
	res.end("404 Not Found");
}

const urlMap = {
	"/": (req, res) => { res.end("Home")},
	"/user": user,
	"/feed": feed
}
