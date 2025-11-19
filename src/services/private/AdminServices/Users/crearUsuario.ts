import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";

const crearUsuarioSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  password: z.string().min(4),
  userImg: z.string().optional(),
});

export const crearUsuario = async (data: z.infer<typeof crearUsuarioSchema>) =>
  handleService(
    "AdminService.crearUsuario",
    async (validData) => {
      const userExist = await UsersModel.findOne({
        $or: [{ email: validData.email }, { phone: validData.phone }],
      });
      if (userExist)
        throw new Error("El usuario ya existe con ese email o teléfono.");

      const nuevoUsuario = new UsersModel({
        ...validData,
        role: "Cliente",
      });

      await nuevoUsuario.save();
      return { message: "Usuario creado correctamente." };
    },
    [data],
    crearUsuarioSchema
  );
