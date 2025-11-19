import type { Request, Response } from "express";
import { AuthService } from "@services/public";
import { setAuthCookiesAndContext } from "@utils/cookies";
import { handleController } from "@utils/controllerHelper";

export const login = handleController(
  "AuthController.login",
  async (req: Request, res: Response) => {
    const { Name, Pass } = req.body;
    if (!Name || !Pass) throw new Error("Faltan datos");

    const loginResult = await AuthService.login(Name, Pass);
    if (!loginResult.ok) throw new Error(loginResult.error);

    const { user, tokens } = loginResult.data;

    // 🍪 Seteamos cookies y contexto
    setAuthCookiesAndContext(req, res, tokens, user);
    console.log("en controller:\n", user, tokens, req.context);

    return {
      message: "Inicio de sesión exitoso",
      user,
    };
  }
);
