import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const banearUsuario = handleController(
  "AdminController.banearUsuario",
  async (req: Request) => {
    const { id } = req.params;
    const result = await AdminService.Users.banearUsuario(id);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Usuario baneado correctamente.",
    };
  }
);
