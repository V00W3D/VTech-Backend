import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const finalizarSolicitud = handleController(
  "AdminController.finalizarSolicitud",
  async (req: Request) => {
    const { id } = req.params;
    const result = await AdminService.Requests.finalizarSolicitud(id);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Solicitud finalizada correctamente.",
      url: result.data.url,
    };
  }
);
