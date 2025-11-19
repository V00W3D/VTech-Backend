import { config } from "dotenv";
config();
import { startServer } from "@config/app";
console.log(`[Backend - TS]
==================================================`);
startServer();
