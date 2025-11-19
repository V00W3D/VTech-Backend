import type { Request, Response } from "express";
import { handleController } from "@utils/controllerHelper";
import { LandingService } from "@services/public";

/**
 * 📦 Obtener todos los servicios activos + sus targets
 */
export const getAllServices = handleController(
  "LandingController.getAllServices",
  async (_req: Request, _res: Response) => {
    const result = await LandingService.getAllServices();
    if (!result.ok) throw new Error(result.error);

    const serviceTypes = result.data;
    const targetsMap = new Map<string, any>();

    for (const type of serviceTypes) {
      for (const target of type.targets || []) {
        if (!targetsMap.has(String(target._id))) {
          targetsMap.set(String(target._id), target);
        }
      }
    }

    const targets = Array.from(targetsMap.values());

    return {
      message: "Datos de landing obtenidos correctamente.",
      data: { serviceTypes, targets },
    };
  }
);
