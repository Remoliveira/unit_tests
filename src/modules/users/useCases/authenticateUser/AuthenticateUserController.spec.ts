import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a new user ", async () => {
    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test",
      password: "123456",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test",
      password: "123456",
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate a user that dont exist", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nopea",
      password: "nope",
    });

    expect(response.status).toBe(401);
  });
  it("should not be able to authenticate a user with wrong password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "test",
      password: "nope",
    });

    expect(response.status).toBe(401);
  });
});
