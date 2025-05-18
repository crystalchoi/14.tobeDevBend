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
	const post = {
		title: body.title, name: body.name, password: body.password, content: body.content, createAt: new Date().toISOString()
	}
	const result = postService.updatePost(collection, body.id, post);
	res.redirect(`/detail/${body.id}`);
})

app.post('/check-password', async (req, res) => {
	const { id, password } = req.body;
	const post = await postService.getPostByIdAndPassword(collection, { id, password });
	if (!post) {
		return res.status(404).send('Wrong credentials');
	} else {
		return res.json( { isExist: true})
	}
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
