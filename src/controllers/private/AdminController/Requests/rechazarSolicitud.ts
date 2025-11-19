import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const rechazarSolicitud = handleController(
  "AdminController.rechazarSolicitud",
  async (req: Request) => {
    const { id } = req.params;
    const result = await AdminService.Requests.rechazarSolicitud(id);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Solicitud rechazada correctamente.",
      url: result.data.url,
    };
  }
);
