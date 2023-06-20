import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("return a 404 if the provided id doesnt exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await globalThis.signup();
  await request(app).put(`/api/tickets/${id}`).set("Cookie", cookie).send({
    title: "",
    price: 100,
  });
  expect(404);
});

it("return a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send({
    title: "",
    price: 100,
  });
  expect(401);
});

it("return a 401 if the user is does not own the ticket", async () => {
  const cookie1 = await globalThis.signup();
  const cookie2 = await globalThis.signup();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
      price: 100,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title: "apple2",
      price: 1000,
    })
    .expect(401);
});

it("return a 400 if the user provides an invalid title or price", async () => {
  const cookie1 = await globalThis.signup();
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
      price: 100,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie1)
    .send({
      title: "",
      price: 1000,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
      price: -12,
    })
    .expect(400);
});

it("update the ticket provided valid input ", async () => {
  const cookie1 = await globalThis.signup();
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
      price: 100,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie1)
    .send({
      title: "newApple",
      price: 1000,
    })
    .expect(200);

  const response = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .expect(200);

  expect(response.body.title).toEqual("newApple");
  expect(response.body.price).toEqual(1000);
});

it("publishes an event", async () => {
  const cookie1 = await globalThis.signup();
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie1)
    .send({
      title: "apple",
      price: 100,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie1)
    .send({
      title: "newApple",
      price: 1000,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
