import { handleController } from "@utils/controllerHelper";
import { AdminService } from "@services/private";

export const fetchUsuarios = handleController(
  "AdminController.fetchUsuarios",
  async () => {
    const result = await AdminService.Users.fetchUsuarios();

    if (!result.ok)
      throw new Error(result.error || "Error al obtener usuarios");

    return {
      message: "Usuarios obtenidos correctamente.",
      data: result.data,
    };
  }
);
