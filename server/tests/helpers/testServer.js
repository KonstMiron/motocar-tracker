import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "../../src/routes/auth.js";
import vehiclesRouter from "../../src/routes/vehicles.js";

export const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api/auth", authRouter);
  app.use("/api/vehicles", vehiclesRouter);

  return app;
};