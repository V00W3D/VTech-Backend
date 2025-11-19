import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";

export const fetchUsuarios = async () =>
  handleService("AdminService.fetchUsuarios", async () => {
    const usuarios = await UsersModel.find().lean();

    return usuarios.map((u: any) => ({
      id: u._id,
      nombre: u.name,
      email: u.email,
      telefono: u.phone,
      rol: u.role,
      imagen: u.userImg || null,
      eliminado: u.deleted,
    }));
  });
