import type { Response, Request } from "express";
import { isProd } from "@config/env";

export interface AuthTokens {
  cupCake: string;
  cake: string;
}

export interface AuthUserPayload {
  Id: string;
  Name: string;
  Role: string;
  Phone: string;
  Email: string;
  UserImg?: string;
}

/**
 * ✅ Setea cookies seguras y sincroniza el contexto de Express
 */
export const setAuthCookiesAndContext = (
  req: Request,
  res: Response,
  tokens: AuthTokens,
  user: AuthUserPayload
): void => {
  // 🍪 Cookies
  res.cookie("CupCake", tokens.cupCake, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60, // 1h
  });

  res.cookie("Cake", tokens.cake, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
  });

  // 🧠 Contexto del usuario (sin any)
  req.context = {
    userId: user.Id,
    name: user.Name,
    role: user.Role,
    phone: user.Phone,
    email: user.Email,
    userImg: user.UserImg || null,
    isTasty: true,
  };
};
