import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const editarUsuarioSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
    userImg: z.string().optional(),
  }),
});

export const editarUsuario = async (id: string, data: any) =>
  handleService(
    "AdminService.editarUsuario",
    async (validInput) => {
      const usuario = await UsersModel.findById(validInput.id);
      if (!usuario) throw new Error("Usuario no encontrado.");

      Object.assign(usuario, validInput.data);
      await usuario.save();

      return { message: "Usuario editado correctamente." };
    },
    [{ id, data }],
    editarUsuarioSchema
  );
