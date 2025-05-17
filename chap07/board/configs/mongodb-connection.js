const { MongoClient } = require('mongodb');
const url = "mongodb+srv://admin:admin@cluster0.aq1waaj.mongodb.net/board"


module.exports = function(callback) {
	return MongoClient.connect(url, callback)
}
