
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.aq1waaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

async function main() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();


		const adminDB = client.db("board").admin();
		// Send a ping to confirm a successful connection
		const collection = await client.db("board").collection("board");
		// const listDatabases = await adminDB.listDatabases()
		// console.log(listDatabases)

		// await collection.insertOne( { name: "Andy", age: 30})

		const docs = await collection.find({ name: "Andy"}).toArray();
		console.log(docs);

	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

main()
	// .then(console.log)
	.catch(console.dir)
	.finally(() => client.close());

