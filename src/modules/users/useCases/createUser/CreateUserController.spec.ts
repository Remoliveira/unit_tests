import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app";

let connection: Connection;
describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user ", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new category if there is the same already created", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
