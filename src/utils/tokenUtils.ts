import jwt from "jsonwebtoken";
import type { Response } from "express";
import { JWT_SECRET, isProd } from "@config/env";

interface TokenResult {
  Ok: boolean;
  Bad?: string;
  Data?: jwt.JwtPayload;
}

//---------------------------------------
// ✅ Valida un token (CupCake o Cake)
export const validateToken = (token: string | undefined): TokenResult => {
  if (!token) return { Ok: false, Bad: "Token no proporcionado" };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return { Ok: true, Data: decoded };
  } catch (err) {
    console.error("[validateToken]", err);
    return { Ok: false, Bad: "Token inválido o expirado" };
  }
};

//---------------------------------------
// 🔁 Refresca el CupCake usando Cake si es válido
export const refreshToken = (
  cupCake: string | undefined,
  cake: string | undefined,
  res: Response
): TokenResult => {
  try {
    // 1️⃣ Validar el CupCake
    const cupCakeResult = validateToken(cupCake);
    if (cupCakeResult.Ok) return cupCakeResult;

    // 2️⃣ Si CupCake inválido → intentar con Cake (refresh)
    if (cake) {
      const cakeResult = validateToken(cake);
      if (cakeResult.Ok && cakeResult.Data) {
        const { Id, Name, Role, UserImg } = cakeResult.Data;

        const newCupCake = jwt.sign({ Id, Name, Role, UserImg }, JWT_SECRET, {
          expiresIn: "1h",
        });

        // 🍪 Actualizar cookie
        res.cookie("CupCake", newCupCake, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          maxAge: 1000 * 60 * 60, // 1h
        });

        return {
          Ok: true,
          Data: jwt.verify(newCupCake, JWT_SECRET) as jwt.JwtPayload,
        };
      }

      return { Ok: false, Bad: "Sesión expirada" };
    }

    return { Ok: false, Bad: "Token inexistente" };
  } catch (err) {
    console.error("[refreshToken]", err);
    return { Ok: false, Bad: "Error inesperado en refreshToken" };
  }
};
