import { RequestsModel } from "@models/Requests";
import { handleService } from "@utils/serviceHelper";

export const getHistorial = async (userId: string) =>
  handleService("RequestsService.getHistorial", async () => {
    const historial = await RequestsModel.find({ userId })
      .sort({ fecha: -1 })
      .lean();

    if (!historial.length) {
      return {
        message: "El usuario no tiene solicitudes registradas.",
        data: [],
      };
    }

    const data = historial.map((req: any) => ({
      id: String(req._id),
      estado: req.status,
      descripcion: req.description,
      fecha: req.fecha,
      servicio: req.service, // texto directo
      target: req.target, // texto directo
    }));

    return {
      message: "Historial obtenido correctamente.",
      data,
    };
  });
