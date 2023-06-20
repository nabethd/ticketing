import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  const cookie = globalThis.signup();
  const title = "apple";
  const price = 10;
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title,
    price,
  });
};
it("can fech a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
