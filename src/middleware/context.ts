import type { Request, Response, NextFunction } from "express";
import { validateToken, refreshToken } from "@utils/tokenUtils";
import { setAuthCookiesAndContext } from "@utils/cookies";
import type { AuthTokens } from "@utils/cookies";

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const cupCake = req.cookies?.CupCake as string | undefined;
  const cake = req.cookies?.Cake as string | undefined;

  // 1️⃣ Intentar validar el CupCake
  const cupCakeResult = validateToken(cupCake);
  if (cupCakeResult.Ok && cupCakeResult.Data) {
    const data = cupCakeResult.Data as Record<string, any>;

    req.context = {
      userId: data.Id ?? null,
      name: data.Name ?? null,
      role: data.Role ?? null,
      phone: data.Phone ?? null,
      email: data.Email ?? null,
      userImg: data.UserImg ?? null,
      isTasty: true,
    };
    return next();
  }

  // 2️⃣ Si CupCake inválido → intentar refrescar con Cake
  const refreshResult = refreshToken(cupCake, cake, res);
  if (refreshResult.Ok && refreshResult.Data) {
    const user = refreshResult.Data as Record<string, any>;
    const tokens: AuthTokens = {
      cupCake: req.cookies?.CupCake ?? "",
      cake: req.cookies?.Cake ?? "",
    };

    setAuthCookiesAndContext(req, res, tokens, {
      Id: user.Id,
      Name: user.Name,
      Role: user.Role,
      Phone: user.Phone,
      Email: user.Email,
      UserImg: user.UserImg,
    });

    return next();
  }

  // 3️⃣ Fallo total → limpiar contexto y devolver error
  req.context = {
    userId: null,
    name: null,
    role: null,
    phone: null,
    email: null,
    userImg: null,
    isTasty: false,
  };

  res.status(401).json({
    ok: false,
    message: refreshResult.Bad || "Sesión expirada",
  });
};
