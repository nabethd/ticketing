import express, { Request } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@ndticketing/common";

import { currentUserRouter } from "./routes/current-user";
import { signUpRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(cors<Request>());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.get("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
