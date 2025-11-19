// src/services/private/Requests/aceptarSolicitud.ts
import { RequestsModel } from "@models/Requests";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const idSchema = z.string().min(1, "ID inválido");

export const aceptarSolicitud = async (id: string) =>
  handleService(
    "AdminService.aceptarSolicitud",
    async () => {
      const solicitud = await RequestsModel.findById(id).populate<{
        userId: { name: string; phone: string };
      }>("userId", "name phone");

      if (!solicitud) throw new Error("Solicitud no encontrada.");
      if (!solicitud.userId) throw new Error("El usuario asociado no existe.");
      if (!solicitud.userId.phone)
        throw new Error("El usuario no tiene teléfono.");

      // request.service y request.target son strings ahora
      const servicioNombre = solicitud.service || "Servicio no encontrado";
      const targetNombre = solicitud.target || "Sin especificar";

      solicitud.status = "aceptada";
      await solicitud.save();

      const mensaje = encodeURIComponent(
        `✅ Hola ${solicitud.userId.name}! Tu solicitud de "${servicioNombre}" (${targetNombre}) fue *ACEPTADA*.`
      );
      const url = `https://wa.me/${solicitud.userId.phone}?text=${mensaje}`;

      return { message: "Solicitud aceptada correctamente.", url };
    },
    [id],
    idSchema
  );
