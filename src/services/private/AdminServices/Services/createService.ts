import { ServiceTypesModel } from "@models/ServiceTypes";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const targetSchema = z.object({
  name: z.string().min(2, "El nombre del target es obligatorio."),
  description: z.string().optional(),
  icon: z.string().optional(),
  deleted: z.boolean().optional().default(false),
});

const createServiceSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio."),
  slogan: z.string().min(3, "El eslogan es obligatorio."),
  shortDescription: z.string().min(5, "Descripción corta inválida."),
  longDescription: z.string().min(10, "Descripción larga inválida."),
  image: z.string().url().optional(),
  targets: z.array(targetSchema).nonempty("Debe incluir al menos un target."),
});

export const createService = async (
  data: z.infer<typeof createServiceSchema>
) =>
  handleService(
    "ServiceTypesService.createService",
    async (validData) => {
      const exists = await ServiceTypesModel.findOne({ name: validData.name });
      if (exists) throw new Error("Ya existe un servicio con ese nombre.");

      const newService = new ServiceTypesModel({
        ...validData,
        targets: validData.targets.map((t: any) => ({
          ...t,
          deleted: t.deleted ?? false,
        })),
      });

      await newService.save();

      return {
        ok: true,
        message: "Servicio creado correctamente.",
        serviceId: newService._id,
      };
    },
    [data],
    createServiceSchema
  );
