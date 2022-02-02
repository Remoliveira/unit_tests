import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app";

let connection: Connection;
describe("Show profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile ", async () => {
    await request(app).post("/api/v1/users").send({
      name: "cont",
      email: "cont",
      password: "123z",
    });

    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "cont",
      password: "123z",
    });

    const { token } = sessions.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it("should not be able to show a profile picture ", async () => {
    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "error",
      password: "123z",
    });

    const { token } = sessions.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });
});
