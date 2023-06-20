import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("return a 404 if a ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it("return the ticket if the ticket is found", async () => {
  const cookie = await globalThis.signup();
  const title = "apple";
  const price = 10;

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
