// @services/public/LandingServices/getAllServices.ts
import { ServiceTypesModel } from "@models/ServiceTypes";
import { handleService } from "@utils/serviceHelper";

export const getAllServices = async () =>
  handleService("LandingService.getAllServices", async () => {
    const services = await ServiceTypesModel.find({
      deleted: false,
    }).lean();

    // Puedes devolverlos así nomás, la landing no necesita extra formato.
    return services.map((s) => ({
      id: s._id,
      name: s.name,
      slogan: s.slogan,
      shortDescription: s.shortDescription,
      longDescription: s.longDescription,
      image: s.image || null,
      targets: s.targets, // ← ahora es un array de objetos YA embebidos
    }));
  });
