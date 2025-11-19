// src/services/private/Requests/fetchSolicitudes.ts
import { RequestsModel } from "@models/Requests";
import { handleService } from "@utils/serviceHelper";

export const fetchSolicitudes = async () =>
  handleService("AdminService.fetchSolicitudes", async () => {
    // solo populamos userId, service/target ya son strings
    const solicitudes = await RequestsModel.find()
      .populate<{ userId: { _id: string; name: string; phone: string } }>(
        "userId",
        "name phone"
      )
      .lean();

    const cleanData = solicitudes.map((req: any) => ({
      id: String(req._id),
      estado: req.status,
      descripcion: req.description,
      fecha: req.fecha,
      usuario: {
        id: req.userId?._id ? String(req.userId._id) : undefined,
        nombre: req.userId?.name || "Desconocido",
        telefono: req.userId?.phone || "N/A",
      },
      // ahora service y target son strings
      servicio: {
        id: null,
        nombre: req.service || "Servicio no especificado",
      },
      target: req.target || "Sin especificar",
    }));

    return cleanData;
  });
