import type { Request, Response } from "express";
import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const blockService = handleController(
  "AdminController.blockService",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.Services.blockService(id);

    if (!result?.ok) {
      return res.status(400).json({ ok: false, message: result?.details });
    }

    return result.data;
  }
);
