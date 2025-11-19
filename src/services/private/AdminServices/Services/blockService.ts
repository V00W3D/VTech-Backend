import { ServiceTypesModel } from "@models/ServiceTypes";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";
import { Types } from "mongoose";

const blockSchema = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: "ID inválido",
});

export const blockService = async (id: string) =>
  handleService(
    "ServiceTypesService.blockService",
    async (validatedId) => {
      const service = await ServiceTypesModel.findById(validatedId);
      if (!service) throw new Error("Servicio no encontrado.");

      // 🔥🔥 TOGGLE REAL
      service.deleted = !service.deleted;
      await service.save();

      return {
        ok: true,
        id: service._id,
        name: service.name,
        deleted: service.deleted,
        message: service.deleted
          ? `Servicio "${service.name}" bloqueado correctamente.`
          : `Servicio "${service.name}" desbloqueado correctamente.`,
      };
    },
    [id],
    blockSchema
  );
