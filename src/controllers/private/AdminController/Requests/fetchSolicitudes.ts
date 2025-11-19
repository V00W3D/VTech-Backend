import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const fetchSolicitudes = handleController(
  "AdminController.fetchSolicitudes",
  async () => {
    const result = await AdminService.Requests.fetchSolicitudes();
    if (!result.ok)
      throw new Error(result.error || "Error al obtener solicitudes");

    return {
      message: "Solicitudes obtenidas correctamente",
      data: result.data,
    };
  }
);
