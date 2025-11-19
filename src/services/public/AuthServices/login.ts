import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UsersModel } from "@models/Users";
import { JWT_SECRET } from "@config/env";
import { handleService } from "@utils/serviceHelper";

interface UserPayload {
  Id: string;
  Name: string;
  Role: string;
  Phone: string;
  Email: string;
  UserImg?: string;
}

/* =====================================================
   🔧 UTILIDAD LOCAL (solo usada acá)
   ===================================================== */
const generateTokens = (payload: UserPayload) => {
  const cupCake = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  const cake = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { cupCake, cake };
};

/* =====================================================
   📘 ZOD SCHEMA
   ===================================================== */
const loginSchema = z.object({
  Name: z.string().min(3, "El nombre es demasiado corto"),
  Pass: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

/* =====================================================
   🧠 LOGIN SERVICE FUNCTION
   ===================================================== */
export const login = async (Name: string, Pass: string) => {
  return handleService(
    "AuthService.login",
    async () => {
      const user = await UsersModel.findOne({ name: Name });
      if (!user) throw new Error("Usuario o contraseña incorrectos");
      if (user.deleted) throw new Error("Usuario baneado indefinidamente");

      const isValid = await bcrypt.compare(Pass, user.password);
      if (!isValid) throw new Error("Usuario o contraseña incorrectos");

      // 🟢 Marca al usuario como activo
      user.active = true;
      await user.save();

      const payload: UserPayload = {
        Id: String(user._id),
        Name: user.name,
        Role: user.role,
        Phone: user.phone,
        Email: user.email,
        UserImg: user.userImg,
      };
      const tokens = generateTokens(payload);
      console.log("en service:\n", payload, tokens);
      return { user: payload, tokens };
    },
    [{ Name, Pass }],
    loginSchema
  );
};
