import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createTestApp } from "../helpers/testServer.js";

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createTestApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test("POST /api/auth/register -> 201", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ username: "miron", email: "miron@example.com", password: "123456" });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.username).toBe("miron");
  expect(res.body.email).toBe("miron@example.com");
});