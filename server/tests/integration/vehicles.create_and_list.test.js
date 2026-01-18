import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestApp } from "../helpers/testServer.js";

let mongod;
let app;
let userId;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createTestApp();

  const r = await request(app)
    .post("/api/auth/register")
    .send({ username: "test", email: "test@example.com", password: "123456" });

  userId = r.body.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test("POST /api/vehicles then GET /api/vehicles/:userId", async () => {
  const createRes = await request(app)
    .post("/api/vehicles")
    .send({ userId, name: "Yamaha MT-07", plate: "LU 12345", year: 2020, mileage: 20000 });

  expect(createRes.status).toBe(201);

  const listRes = await request(app).get(`/api/vehicles/${userId}`);
  expect(listRes.status).toBe(200);
  expect(Array.isArray(listRes.body)).toBe(true);
  expect(listRes.body.length).toBe(1);
  expect(listRes.body[0].name).toBe("Yamaha MT-07");
});