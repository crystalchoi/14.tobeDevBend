const paginator  = require('../utils/paginator');

async function writePost(collection, post) {
	post.hits = 0;
	post.createdAt = new Date().toISOString();
	const result = await collection.insertOne(post);
	// console.log(result);
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

module.exports = {
	writePost, list
}
