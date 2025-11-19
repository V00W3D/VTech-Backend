export const IP = process.env.IP!;
export const PORT = Number(process.env.PORT)!;
export const FRONTEND_PORT = Number(process.env.FRONTEND_PORT)!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const MONGO_URI = process.env.MONGO_URI!;
//=======================================================
const envMode = process.env.NODE_ENV;
export const isProd = envMode === "prod" || envMode === "production";
export const isDev = envMode === "dev" || envMode === "development";
