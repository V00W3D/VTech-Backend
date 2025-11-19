import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";
import type { Request } from "express";

export const aceptarSolicitud = handleController(
  "AdminController.aceptarSolicitud",
  async (req: Request) => {
    const { id } = req.params;
    const result = await AdminService.Requests.aceptarSolicitud(id);

    if (!result.ok) throw new Error(result.error);

    return {
      message: result.data.message || "Solicitud aceptada correctamente.",
      url: result.data.url,
    };
  }
);
