const request = require("supertest");
const app = require("../app");

describe("Items API", () => {
    it("should create a new item", async () => {
    const newItem = {
        name: "Test Item",
        description: "This is a test item",
    };

    const response = await request(app)
        .post("/api/items")
        .send(newItem)
        // Token d'authentification à changer en fonction du user
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15dXNlcm5hbWUiLCJpYXQiOjE2ODcxODAyMzZ9.tztk7c3DoZedl1SDz2fbvdjVUZdqvNURDvUFiwN_edU"); 

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.description).toBe(newItem.description);
    });

    it("should return a list of items", async () => {
    const response = await request(app)
        .get("/api/items")
        // Token d'authentification à changer en fonction du user
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15dXNlcm5hbWUiLCJpYXQiOjE2ODcxODAyMzZ9.tztk7c3DoZedl1SDz2fbvdjVUZdqvNURDvUFiwN_edU");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    });

    it("should update an existing item", async () => {
    const itemId = "649055330ffeb1e0eb1080b5"; // Changer l'ID à chaque test car il se delete
    const updatedItem = {
        name: "Updated Item",
        description: "This item has been updated",
    };

    const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send(updatedItem)
        // Token d'authentification à changer en fonction du user
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15dXNlcm5hbWUiLCJpYXQiOjE2ODcxODAyMzZ9.tztk7c3DoZedl1SDz2fbvdjVUZdqvNURDvUFiwN_edU");

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedItem.name);
    expect(response.body.description).toBe(updatedItem.description);
    });

    it("should delete an existing item", async () => {
    const itemId = "649055330ffeb1e0eb1080b5"; // Changer l'ID à chaque test car il se delete

    const response = await request(app)
        .delete(`/api/items/${itemId}`)
        // Token d'authentification à changer en fonction du user
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15dXNlcm5hbWUiLCJpYXQiOjE2ODcxODAyMzZ9.tztk7c3DoZedl1SDz2fbvdjVUZdqvNURDvUFiwN_edU");

    expect(response.statusCode).toBe(204);
    });
});
