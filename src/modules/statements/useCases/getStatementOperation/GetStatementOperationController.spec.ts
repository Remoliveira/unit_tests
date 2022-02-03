import request from "supertest";
import { Connection, createConnection } from "typeorm";


import { app } from "../../../../app";


let connection: Connection;
describe("Get statement operation controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation ", async () => {
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


    const operation = await request(app).post("/api/v1/statements/deposit").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 234,
      description: 'DEPOSIT'
    })
    const { id } = operation.body;
    const response = await request(app).get(`/api/v1/statements/${id}`).set({ Authorization: `Bearer ${token}`, })

    expect(response.body.type).toEqual('deposit');
  });


  it("should not be able to get statement opteration for a non-existent user", async () => {
    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "depo",
      password: "123456s",
    });

    const { token } = sessions.body;
    const response = await request(app).get(`/api/v1/statements/32323`).set({ Authorization: `Bearer ${token}`, })

    expect(response.statusCode).toEqual(401)
  });

  it("should not be able to get statement opteration for a non-existent user", async () => {
    const sessions = await request(app).post("/api/v1/sessions").send({
      email: "depo",
      password: "123456",
    });

    const { token } = sessions.body;

    await request(app).post("/api/v1/statements/deposit").set({ Authorization: `Bearer ${token}`, }).send({
      amount: 234,
      description: 'DEPOSIT'
    })
    const id = '719123e8-0174-4a66-a71d-7e0a2cfc3351'
    const response = await request(app).get(`/api/v1/statements/${id}`).set({ Authorization: `Bearer ${token}`, })

    expect(response.statusCode).toEqual(404)
  });
});
