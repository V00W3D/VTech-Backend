import bcrypt from "bcrypt";
import { z } from "zod";
import { UsersModel } from "@models/Users";
import { handleService } from "@utils/serviceHelper";

const registerSchema = z.object({
  Name: z.string().min(3),
  Pass: z.string().min(6),
  Email: z.email(),
  Phone: z.string().min(6),
  UserImg: z.string().optional(),
});

export const register = (
  Name: string,
  Pass: string,
  Email: string,
  Phone: string,
  UserImg?: string
) => {
  return handleService(
    "AuthService.register",
    async () => {
      const hashedPass = await bcrypt.hash(Pass, 10);

      const user = await UsersModel.create({
        name: Name,
        email: Email,
        phone: Phone,
        password: hashedPass,
        userImg: UserImg ? UserImg : "",
        role: "Cliente",
        deleted: false,
      });

      if (!user) throw new Error("Error al registrar");
      return { ok: true };
    },
    [{ Name, Pass, Email, Phone }],
    registerSchema
  );
};
