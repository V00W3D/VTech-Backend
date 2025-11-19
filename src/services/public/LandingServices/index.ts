// @services/public/LandingServices/index.ts
import { getAllServices } from "./getallservices";
import { createRequest } from "./createrequest";
import { cancelRequest } from "./cancelRequest";
import { getHistorial } from "./getHistorial";

export const LandingService = {
  getAllServices,
  createRequest,
  cancelRequest,
  getHistorial,
};
