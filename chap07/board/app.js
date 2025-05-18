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



app.listen(8000, async () => {
	console.log("Server started on port 8000");
	const mongoClient = await mongodbConnection();

	collection = mongoClient.db().collection("board");
	console.log("MongoDB Connected");
})


app.engine('handlebars',
	handlebars.create({ helpers: require("./configs/handlebars-helpers"), }).engine
);
