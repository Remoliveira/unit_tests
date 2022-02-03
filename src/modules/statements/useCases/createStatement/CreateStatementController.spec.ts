import request from "supertest";
import { Connection, createConnection } from "typeorm";


import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new statement deposit ", async () => {
    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "depo",
      password: "123456",
    });

    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "depo",
      password: "123456",
    });

    const { token } = sessions.body;


    const response = await request(app).post("/api/v1/statements/deposit").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 234,
      description: 'DEPOSIT'
    })
    expect(response.status).toBe(201);
  });

  it("should be able to create a new statement withdraw ", async () => {

    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "depo",
      password: "123456",
    });

    const { token } = sessions.body;


    const response = await request(app).post("/api/v1/statements/withdraw").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 100,
      description: 'WITHDRAW'
    })
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new statement with a withdraw bigger than the balance", async () => {
    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "depo",
      password: "123456",
    });

    const { token } = sessions.body;


    const response = await request(app).post("/api/v1/statements/withdraw").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 1000,
      description: 'WITHDRAW'
    })


    expect(response.status).toBe(400);
  });
});
