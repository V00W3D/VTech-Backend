// src/controllers/public/LandingController/createRequest.ts
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { handleController } from "@utils/controllerHelper";
import { LandingService } from "@services/public";

export const createRequest = handleController(
  "LandingController.createRequest",
  async (req: Request, res: Response) => {
    // req.context debe venir del middleware de auth
    const ctx = req.context;
    const userId = ctx?.userId;
    const { service, target, description } = req.body;

    if (!userId || !service || !target || !description) {
      res.status(400);
      throw new Error("Faltan datos obligatorios.");
    }

    const result = await LandingService.createRequest({
      userId,
      service,
      target,
      description,
    });

    if (!result.ok) throw new Error(result.error);

    return {
      message: "Solicitud creada correctamente.",
      data: result.data,
    };
  }
);
