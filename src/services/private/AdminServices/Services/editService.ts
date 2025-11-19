import { ServiceTypesModel } from "@models/ServiceTypes";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const targetSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  deleted: z.boolean().optional(),
});

const editServiceSchema = z.object({
  id: z.string().min(3, "ID inválido"), // ahora no validamos ObjectId

  name: z.string().min(3).optional(),
  slogan: z.string().min(3).optional(),
  shortDescription: z.string().min(5).optional(),
  longDescription: z.string().min(10).optional(),
  image: z
    .string()
    .refine(
      (v) => v.startsWith("/") || v.startsWith("./") || /^https?:\/\//.test(v),
      { message: "La imagen debe ser URL válida o ruta interna" }
    )
    .optional(),

  targets: z.array(targetSchema).optional(),
});

export const editService = async (id: string, data: any) =>
  handleService(
    "ServiceTypesService.editService",
    async (validInput) => {
      const { id, ...fields } = validInput;

      const service = await ServiceTypesModel.findOne({ _id: id });
      if (!service) throw new Error("Servicio no encontrado.");

      // Si vienen nuevos targets → reemplazo completo
      if (fields.targets) {
        service.targets = fields.targets.map((t: any) => ({
          name: t.name ?? "",
          description: t.description ?? "",
          icon: t.icon ?? "",
          deleted: t.deleted ?? false,
        }));
        delete fields.targets;
      }

      Object.assign(service, fields);

      await service.save();

      return {
        ok: true,
        message: "Servicio editado correctamente.",
        id: service._id,
      };
    },
    [{ id, ...data }],
    editServiceSchema
  );
