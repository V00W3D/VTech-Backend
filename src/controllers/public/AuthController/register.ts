import type { Request, Response } from "express";
import { AuthService } from "@services/public";
import { handleController } from "@utils/controllerHelper";

export const register = handleController(
  "AuthController.register",
  async (req: Request, _res: Response) => {
    const { Name, Pass, Email, Phone } = req.body;
    if (!Name || !Pass || !Email || !Phone) throw new Error("Faltan datos");

    const result = await AuthService.register(Name, Pass, Email, Phone);
    if (!result.ok) throw new Error(result.error);

    return {
      message: "Usuario registrado correctamente",
      data: result.data,
    };
  }
);
