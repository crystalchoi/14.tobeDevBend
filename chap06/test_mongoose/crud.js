const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const Person = require('./person_model');



mongoose.set("strictQuery", false)

const app = express();
app.use(bodyParser.json());
app.listen(8000, async () => {
	console.log("Server started on port 8000");
	// const url = "mongodb+srv://admin:admin@cluster0.aq1waaj.mongodb.net/test?retryWrites=true&w=majority"
	const url = "mongodb+srv://admin:admin@cluster0.aq1waaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	mongoose.connect(url)
		.then(console.log("MongoDB Connected"));


	app.get("/person",  async (req, res) => {
		const person = await Person.find({})
		res.send(person)
	})


	app.get("/person/:email",  async (req, res) => {
		const person = await Person.find({ email: req.params.email })
		res.send(person)
	})

	app.post("/person", async function (req, res) {
		const person = new Person( req.body );
		await person.save()
		res.send(person)
	})


	app.put("/person/:email", async function (req, res) {
		const person = await Person.findOneAndUpdate( { email: req.params.email },
			{ $set: req.body }, { new: true })
		console.log(person)
		res.send(person)
	})

	app.delete("/person/:email", async function (req, res) {
		// await Person.findByIdAndDelete( { email: req.params.email }, { new: true })
		await Person.deleteMany({ email: req.params.email })
		res.send({success: true})
	})
});

