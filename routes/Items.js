var express = require("express");
var router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { connectToMongoDB } = require("../middleware/db");
const { uuid } = require("uuidv4");
const { ObjectId } = require("mongodb");

router.post("/", authenticateToken, async (req, res) => {
	const { name, description } = req.body;
	const { itemsCollection } = await connectToMongoDB();

	if (!name || !description) {
		return res
			.status(400)
			.json({ error: "Name and description are required fields" });
	}

	const newItem = {
		id: uuid(),
		name,
		description,
	};

	try {
		const result = await itemsCollection.insertOne(newItem);
		newItem.id = result.insertedId;
		res.status(201).json(newItem);
	} catch (error) {
		console.error("Error creating item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/", authenticateToken, async (req, res) => {
	const { itemsCollection } = await connectToMongoDB();

	try {
		const items = await itemsCollection.find().toArray();
		res.json(items);
	} catch (error) {
		console.error("Error fetching items:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.put("/:id", authenticateToken, async (req, res) => {
	const itemId = req.params.id;
	const { name, description } = req.body;
	const { itemsCollection } = await connectToMongoDB();

	if (!name || !description) {
		return res
			.status(400)
			.json({ error: "Name and description are required fields" });
	}

	try {
		const existingItem = await itemsCollection.findOne({
			_id: new ObjectId(itemId),
		});
		if (!existingItem) {
			return res.status(404).json({ error: "Item not found" });
		}

		const updatedItem = {
			name,
			description,
		};

		await itemsCollection.updateOne(
			{ _id: new ObjectId(itemId) },
			{ $set: updatedItem }
		);

		res.json(updatedItem);
	} catch (error) {
		console.error("Error updating item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.delete("/:id", authenticateToken, async (req, res) => {
	const itemId = req.params.id;
	const { itemsCollection } = await connectToMongoDB();

	try {
		const existingItem = await itemsCollection.findOne({
			_id: new ObjectId(itemId),
		});
		if (!existingItem) {
			return res.status(404).json({ error: "Item not found" });
		}
		await itemsCollection.deleteOne({ _id: new ObjectId(itemId) });

		res.sendStatus(204);
	} catch (error) {
		console.error("Error deleting item:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
