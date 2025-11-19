import { UsersModel } from "@models/Users";
import { RequestsModel } from "@models/Requests";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const cancelSchema = z.object({
  userId: z.string().min(1, "ID de usuario inválido"),
  requestId: z.string().min(1, "ID de solicitud inválido"),
});

export const cancelRequest = async (data: {
  userId: string;
  requestId: string;
}) =>
  handleService(
    "RequestsService.cancelRequest",
    async () => {
      const { userId, requestId } = cancelSchema.parse(data);

      const user = await UsersModel.findById(userId);
      if (!user) throw new Error("Usuario no encontrado.");

      // ✅ Verificar que la request pertenece al usuario
      if (!user.requests.some((req) => req.toString() === requestId))
        throw new Error("La solicitud no pertenece a este usuario.");

      const request = await RequestsModel.findById(requestId);
      if (!request) throw new Error("Solicitud no encontrada.");

      if (request.status === "cancelada")
        throw new Error("Esta solicitud ya fue cancelada.");

      request.status = "cancelada";
      await request.save();

      return { message: "Solicitud cancelada correctamente." };
    },
    [data],
    cancelSchema
  );
