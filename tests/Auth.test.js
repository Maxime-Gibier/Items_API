const request = require("supertest");
const app = require("../app");
const { connectToMongoDB } = require("../middleware/db");
const bcrypt = require("bcrypt");

describe("Authentication API", () => {
	let usersCollection;
	beforeAll(async () => {
		// Connect to MongoDB before running the tests
		await connectToMongoDB();
		const { usersCollection: collection } = await connectToMongoDB();
		usersCollection = collection;
	});

	afterAll(async () => {
		// Close MongoDB connection after running the tests
		await usersCollection.deleteMany({});
	});

	describe("POST /register", () => {
		it("should create a new user", async () => {
			const user = {
				username: "testuser",
				password: "testpassword",
			};

			const response = await request(app)
				.post("/api/register")
				.send(user);

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty("username", user.username);
            expect(response.body).toEqual(expect.objectContaining({
                username: user.username,
            }));

			const createdUser = await usersCollection.findOne({ username: user.username });
			expect(createdUser).toBeTruthy();
			expect(createdUser.username).toBe(user.username);
		});

		it("should return 400 if username or password is missing", async () => {
			const response = await request(app).post("/api/register").send({});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty("error", "Username and password are required fields");
		});

		it("should return 409 if username already exists", async () => {
			const user = {
				username: "existinguser",
				password: "testpassword",
			};

			await usersCollection.insertOne(user);

			const response = await request(app)
				.post("/api/register")
				.send({ username: user.username, password: "newpassword" });

			expect(response.statusCode).toBe(409);
			expect(response.body).toHaveProperty("error", "Username already exists");
		});
	});

	describe("POST /api/login", () => {
		it("should return a token on successful login", async () => {
			const user = {
				username: "testuser",
				password: "testpassword",
			};

			const hashedPassword = await bcrypt.hash(user.password, 10);
			await usersCollection.insertOne({ username: user.username, password: hashedPassword });

			const response = await request(app).post("/api/login").send(user);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("token");
		});

		it("should return 400 if username or password is missing", async () => {
			const response = await request(app).post("/api/login").send({});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty("error", "Username and password are required fields");
		});

		it("should return 401 if username or password is invalid", async () => {
			const user = {
				username: "blablabla",
				password: "blablablaaaa",
			};

			const response = await request(app).post("/api/login").send(user);

			expect(response.statusCode).toBe(401);
			expect(response.body).toHaveProperty("error", "Invalid username or password");
		});
	});
});
