const { MongoClient } = require("mongodb");

// Configuration de la connexion à MongoDB
const mongoURI = "mongodb://localhost:27017"; // Remplacez par votre URI MongoDB
const dbName = "myDatabase"; // Remplacez par le nom de votre base de données
const collectionItems = "items"; // Remplacez par le nom de votre collection "items"
const collectionUsers = "users"; // Remplacez par le nom de votre collection "users"

// Fonction de connexion à MongoDB
async function connectToMongoDB() {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();
		const db = client.db(dbName);
		const itemsCollection = db.collection(collectionItems);
		const usersCollection = db.collection(collectionUsers);
		console.log("Connected to MongoDB");
		return { itemsCollection, usersCollection };
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
}

module.exports = {
	connectToMongoDB,
};
