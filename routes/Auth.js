const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectToMongoDB } = require("../middleware/db");

// Route d'inscription (Register)
router.post("/register", async (req, res) => {
    const { usersCollection } = await connectToMongoDB();
	const { username, password } = req.body;
    
	if (!username || !password) {
        return res
        .status(400)
			.json({ error: "Username and password are required fields" });
	}

	const existingUser = await usersCollection.findOne({ username });
	if (existingUser) {
		return res.status(409).json({ error: "Username already exists" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = {
		username,
		password: hashedPassword,
	};

	try {
		const result = await usersCollection.insertOne(newUser);
		newUser.id = result.insertedId;
		res.status(201).json(newUser);
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Route d'authentification
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
    const { usersCollection } = await connectToMongoDB();

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "Username and password are required fields" });
	}

	const user = await usersCollection.findOne({ username });
	if (!user) {
		return res.status(401).json({ error: "Invalid username or password" });
	}
    
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const token = jwt.sign({ username: user.username }, "your-secret-key");

	res.json({ token });
});

module.exports = router;
