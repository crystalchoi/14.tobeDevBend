const paginator  = require('../utils/paginator');
const { ObjectId } = require('mongodb');

async function writePost(collection, post) {
	post.hits = 0;
	post.createdAt = new Date().toISOString();
	const result = await collection.insertOne(post);
	console.log(result);
	return result;
}

async function list(collection, page, search) {
	const perPage = 10
	const query = { title: new RegExp(search, 'i') };
	const cursor = await collection.find(query, {  limit: perPage , skip: (page - 1) * perPage }).sort({
		createdAt: -1
	});
	const totalCount = await collection.count(query)

	const posts = await cursor.toArray()
	console.log("totalCount: ", totalCount, " cursor:", posts.length, " page:", page);
	const paginatorObj = paginator({ totalCount, page, perPage: perPage });
	return [posts, paginatorObj];
}



const projectionOption = {
	projection : {
		password: 0, "comments.password": 0
	}
}
async function getDetailPost(collection, id) {
	// const  one = await collection.findOne({});
	// console.log("findOne: ", one);
	const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { hits: 1 }}, projectionOption)
	console.log("getDetailPost: ", result, " id: ", id)
	return result
}



async function getPostByIdAndPassword(collection, { id, password }) {
	return result = await collection.findOne({ _id: new ObjectId(id), password: password }, projectionOption)
}

async function updatePost(collection, id, post) {
	const toUpdatePost = { $set: { ...post} }

	return result = await collection.updateOne({ _id: new ObjectId(id) }, toUpdatePost);
}

async function deletePost(collection, id, password) {
	return result = await collection.deleteOne({ _id: new ObjectId(id), password: password });
}
module.exports = {
	writePost, list, getDetailPost, getPostByIdAndPassword, updatePost, deletePost
}
