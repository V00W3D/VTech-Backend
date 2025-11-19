import type { Request, Response } from "express";
import { AuthService } from "@services/public";
import { handleController } from "@utils/controllerHelper";

export const logout = handleController(
  "AuthController.logout",
  async (req: Request, res: Response) => {
    const { userId } = req.context || {};
    if (!userId) throw new Error("No autenticado");

    const result = await AuthService.logout(userId);
    if (!result.ok) throw new Error(result.error);

    res.clearCookie("CupCake");
    res.clearCookie("Cake");

    return { message: "Sesión cerrada" };
  }
);
