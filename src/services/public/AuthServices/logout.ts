import { z } from "zod";
import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";

const logoutSchema = z.object({
  userId: z.string().min(1),
});

export const logout = async (userId: string) => {
  return handleService(
    "AuthService.logout",
    async () => {
      const user = await UsersModel.findById(userId);
      if (!user) throw new Error("Usuario no encontrado");

      // 🔴 Marca como inactivo
      user.active = false;
      await user.save();

      return { ok: true };
    },
    [{ userId }],
    logoutSchema
  );
};
