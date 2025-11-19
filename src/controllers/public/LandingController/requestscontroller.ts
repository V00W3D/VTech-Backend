import type { Request, Response } from "express";
import { LandingService } from "@services/public";
export const RequestsController = {
  historial: async (req: Request, res: Response) => {
    const result = await LandingService.getHistorial(req.params.userId);
    res.status(200).json(result);
  },

  cancelar: async (req: Request, res: Response) => {
    const result = await LandingService.cancelRequest({
      userId: req.params.userId,
      requestId: req.params.requestId,
    });
    res.status(200).json(result);
  },
};
