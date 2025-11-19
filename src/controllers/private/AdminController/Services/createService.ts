import type { Request, Response } from "express";
import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const createService = handleController(
  "AdminController.createService",
  async (req: Request, res: Response) => {
    const result = await AdminService.Services.createService(req.body);

    if (!result?.ok) {
      return res.status(400).json({ ok: false, message: result?.details });
    }

    return result.data;
  }
);
