import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  function signup(): string[];
}
jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

globalThis.signup = () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  // build a JWT payload
  const payload = {
    id,
    email: "test@test.com",
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build a session Object {jwt: my_jwt}
  const session = { jwt: token };

  //Turn the session into JSON
  const sessionJson = JSON.stringify(session);

  //TAke the JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
