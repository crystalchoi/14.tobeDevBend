const express = require('express');
const app = express();
let posts = []

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
	res.json(posts)
})
app.post('/posts', (req, res) => {

	if (req.body) {
		const { title, name, text} = req.body
	  posts.push({ id: posts.length + 1, title: title, name: name, text: text,  createdAt: Date() });
	  res.json({ title, name, text})
		console.log( title, name, text);
	} else {
		res.json(posts)
	}
})

app.delete('/posts/:id', (req, res) => {
	const id = req.params.id;
	const filteredPosts = posts.filter(post => post.id !== +id);
	const isLengthChanged = posts.length !== filteredPosts.length
	posts = filteredPosts
	if (isLengthChanged) {
		res.json(`OK ${ id }`)
		return
	}
	res.json("NOT changed")
})



app.listen(8000, () => {
	console.log('Listening on 8000');
})
