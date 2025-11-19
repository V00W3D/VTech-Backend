import type { Request, Response } from "express";
import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const editService = handleController(
  "AdminController.editService",
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.Services.editService(id, req.body);

    if (!result?.ok) {
      return res.status(400).json({ ok: false, message: result?.details });
    }

    return result.data;
  }
);
