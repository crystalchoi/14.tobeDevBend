const express = require('express')
const app = express()
const url = require('url')
const port = 8000

app.get('/', (req, res) => {
	res.set({ "Content-Type": "text/plain" })
	res.end(`Hello World!`)
})


app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

app.get("/", (req, res) => {
	res.end(`Home`)
})
app.get('/user', user)
app.get('/feed', feed)

function user(req, res)  {
	const userInfo = url.parse(req.url, true).query
	// res.json("")
	res.json(`[user] name: ${ userInfo.name }, age: ${ userInfo.age }`)
}

function feed(req, res) {
	res.json(`<ul>${req.url}<li>picture1</li><li>picture2</li><li>picture3</li></ul>`);
}
