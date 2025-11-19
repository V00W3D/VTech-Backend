import type { Request, Response } from "express";
import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const fetchServices = handleController(
  "AdminController.fetchServices",
  async (req: Request, res: Response) => {
    const result = await AdminService.Services.fetchServices();

    if (!result?.ok) {
      return res.status(400).json({ ok: false, message: result?.details });
    }

    return result.data;
  }
);
