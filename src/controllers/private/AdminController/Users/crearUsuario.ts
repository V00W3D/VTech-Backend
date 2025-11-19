import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const crearUsuario = handleController(
  "AdminController.crearUsuario",
  async (req: Request) => {
    const result = await AdminService.Users.crearUsuario(req.body);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Usuario creado correctamente.",
    };
  }
);
