import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import { config } from "./config/config.js";
import { env } from "prisma/config";
import { AppRoutes } from "./routers/routes.js";

console.log(env("DATABASE_URL"));
const app = express();

const port = config.PORT;

app.use(express.json());

app.use(cors());

app.use(AppRoutes.routes);

app.set("json replacer", (_: any, value: { toString: () => any }) =>
  typeof value === "bigint" ? value.toString() : value,
);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
