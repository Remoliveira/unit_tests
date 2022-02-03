import request from "supertest";
import { Connection, createConnection } from "typeorm";


import { app } from "../../../../app";
import { GetBalanceError } from "./GetBalanceError";

let connection: Connection;
describe("Get Balance controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance ", async () => {
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


    await request(app).post("/api/v1/statements/deposit").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 234,
      description: 'DEPOSIT'
    })

    const response = await request(app).get("/api/v1/statements/balance").set({ Authorization: `Bearer ${token}`, })

    expect(response.body.balance).toBe(234);
  });


  it("should not be able to get a balance for a non-existent user", async () => {
    const token = 'odmomwodmopwm'
    const response = await request(app).get("/api/v1/statements/balance").set({ Authorization: `Bearer ${token}`, })

    expect(response.statusCode).toEqual(401)
  });
});
