import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const idSchema = z.string().min(1, "ID inválido");

export const banearUsuario = async (id: string) =>
  handleService(
    "AdminService.banearUsuario",
    async (validId) => {
      const usuario = await UsersModel.findById(validId);
      if (!usuario) throw new Error("Usuario no encontrado.");

      usuario.deleted = !usuario.deleted;
      await usuario.save();

      const estado = usuario.deleted ? "baneado" : "desbaneado";
      return { message: `Usuario ${estado} correctamente.` };
    },
    [id],
    idSchema
  );
