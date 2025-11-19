import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const editarUsuario = handleController(
  "AdminController.editarUsuario",
  async (req: Request) => {
    const { id } = req.params;
    const result = await AdminService.Users.editarUsuario(id, req.body);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Usuario editado correctamente.",
    };
  }
);
