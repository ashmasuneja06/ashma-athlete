const request = require('supertest');
const app = require('../src/app');

describe("Athlete API Tests", () => {

    it("GET /athletes should return 200", async () => {
        const res = await request(app).get('/athletes');
        expect(res.statusCode).toBe(200);
    });

    it("POST /athletes should add athlete", async () => {
        const res = await request(app)
            .post('/athletes')
            .send({ name: "John", sport: "Cricket" });

        expect(res.statusCode).toBe(200);
    });

});