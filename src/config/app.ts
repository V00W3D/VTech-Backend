import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { AuthMiddleware } from "@middleware/context";
import { IP, PORT, FRONTEND_PORT, MONGO_URI } from "@config/env";
//==================================================
const APP = express();
const URL = `http://${IP}:${PORT}/`;
//==================================================
APP.use(cookieParser());
APP.use(express.json());
APP.use(cors({ origin: `http://${IP}:${FRONTEND_PORT}`, credentials: true }));
APP.use(helmet());
APP.use(morgan("dev"));
APP.get("/", (_req, res) => {
  res.json({ ok: true, "~": "El inicio del fin..." });
});
APP.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
//==================================================
import { AuthRoutes, AdminRoutes, LandingRoutes } from "@routes/index";
APP.use("/auth", AuthRoutes);
APP.use("/landing", LandingRoutes);
APP.use(AuthMiddleware);
APP.use("/admin", AdminRoutes);
//==================================================
export const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    APP.listen(PORT, IP, () => {
      console.log(`[Express] API: "${URL}"
[MongoDB] URI: "${MONGO_URI}"
==================================================`);
    });
  } catch (err: any) {
    console.error(`Algo salió mal: ${err}`);
  }
};
