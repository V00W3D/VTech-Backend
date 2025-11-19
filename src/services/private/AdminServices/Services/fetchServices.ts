import { ServiceTypesModel } from "@models/ServiceTypes";
import { handleService } from "@utils/serviceHelper";

export const fetchServices = async () =>
  handleService("ServiceTypesService.fetchServices", async () => {
    const services = await ServiceTypesModel.find().lean();

    return {
      ok: true,
      message: "Servicios obtenidos correctamente.",
      data: services.map((s) => ({
        id: s._id,
        name: s.name,
        slogan: s.slogan,
        shortDescription: s.shortDescription,
        longDescription: s.longDescription,
        image: s.image || null,
        targets: s.targets,
        activo: !s.deleted,
      })),
    };
  });
