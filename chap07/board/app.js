const express = require('express');
const handlebars = require('express-handlebars');
const {MongoClient} = require("mongodb");
const mongodbConnection = require('./configs/mongodb-connection');
const postService = require('./services/post-service');
const app = express();

app.engine('handlebars', handlebars.engine());
app.set("view engine", "handlebars");
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let collection;

app.get('/', async (req, res) => {

	const page = parseInt(req.query.page) || 1;
	const search = parseInt(req.query.search) || '';

	console.log("page: ", page, search);
	try {
		const [ posts, paginator ]	= await postService.list(collection, page, search)
		res.render("home", { search , paginator, posts})
	} catch(err) {
		console.log(err);
		res.render("home", { title: "hi"});
	}
})

app.get('/detail/:id', async (req, res) => {
	const result = await postService.getDetailPost(collection, req.params.id);
	res.render("detail", { title: "상세페이지", post: result });
})

app.post('/write', async (req, res) => {
	const post = req.body;
	const result = await postService.writePost(collection, post);
	console.log(req.body,  result.insertedId);
	res.redirect(`/detail/${result.insertedId}`);
})

app.get('/write', (req, res) => {
	res.render("write", { title: "", mode: "create"});
})


app.get('/modify/:id', async (req, res) => {
	const  id  = req.params.id;
	console.log(req.params.id, id);
	const post = await postService.getDetailPost(collection, id);
	console.log(post);
	res.render('write', { title: "", mode: "modify", post: post });
})

app.post('/modify', async (req, res) => {
	const body = req.body
	let post =  {
		title: body.title, name: body.name, content: body.content, createdAt: new Date().toISOString()
	}
	if (body.password) {
		post = { ...post, password: body.password };
	}
	const result = postService.updatePost(collection, body.id, post);
	res.redirect(`/detail/${body.id}`);
})

app.delete('/delete', async (req, res) => {
	const { id, password } = req.body;

	const result = postService.deletePost(collection, id, password);
	if (result !== 1) {
		return res.json( { isSuccess: false, error: "No such post" });
	}  else {
		return res.json( { isSuccess: true});
	}
})

app.post('/check-password', async (req, res) => {
	const { id, password } = req.body;
	const post = await postService.getPostByIdAndPassword(collection, { id, password });
	if (!post) {
		return res.status(404).send({ message: "wrong password" } );
	}
	return res.json( { isExist: true} )
})


app.post('/write-comment', async (req, res) => {
	const { id, name, password,  comment } = req.body;
	const post = await postService.getPostById(collection, id);

	if (post.comments) {
		post.comments.push({ idx: post.comments.length + 1, name, password, comment, createdAt: new Date().toISOString() });
	} else {
		post.comments = [{ idx: 1, name, password, comment, createdAt: new Date().toISOString() }];
	}

	await postService.updatePost(collection, id, post);
	return res.redirect(`/detail/${id}`);
})

app.listen(8000, async () => {
	console.log("Server started on port 8000");
	const mongoClient = await mongodbConnection();

	collection = mongoClient.db().collection("board");
	console.log("MongoDB Connected");
})

app.engine('handlebars',
	handlebars.create({ helpers: require("./configs/handlebars-helpers"), }).engine
);
