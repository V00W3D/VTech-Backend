// @utils/controllerHelper.ts
import type { Request, Response } from "express";
import { Debug } from "@utils/debugger";

type ControllerFn = (req: Request, res: Response) => Promise<any>;

export function handleController(
  scope: string,
  fn: ControllerFn
): ControllerFn {
  return async (req, res) => {
    try {
      const result = await fn(req, res);
      if (!res.headersSent) {
        return res.status(200).json({
          ok: true,
          ...result,
        });
      }
    } catch (err: any) {
      Debug.error(scope, "Controller error", err);
      if (!res.headersSent) {
        return res.status(err?.status || 400).json({
          ok: false,
          message: err?.message || "Error interno del servidor",
        });
      }
    }
  };
}
