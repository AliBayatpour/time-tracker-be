import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import HttpError from "./models/http-error";
import usersRoutes from "./routes/users-routes";
import itemsRoutes from "./routes/items-routes";
import pool from "./pool";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ message: "ok" });
});
app.use("/api/users", usersRoutes);
app.use("/api/items", itemsRoutes);

app.use(() => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});
console.log(process.env.POSTGRES_HOST);
pool
  .connect({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })
  .then(() => {
    app.listen(4001, () => {
      console.log(`Example app listening on port 4200`);
    });
  })
  .catch((err: Error) => console.log(err));
