// @utils/ServiceHelper.ts
import { Debug } from "@utils/debugger";
import { z } from "zod";
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown };

type ServiceFn<T> = (...args: any[]) => Promise<T>;

/**
 * handleService
 * - scope: etiqueta para logs (ej. "AuthService.register")
 * - fn: función que contiene la lógica real del servicio
 * - args: argumentos que se pasarán a fn
 * - schema?: ZodSchema opcional para validar args[argIndex]
 * - argIndex: índice del argumento a validar (por defecto 0)
 *
 * Devuelve ServiceResult<T>
 */
export async function handleService<T>(
  scope: string,
  fn: ServiceFn<T>,
  args: any[] = [],
  schema?: z.ZodType<any>,
  argIndex: number = 0
): Promise<ServiceResult<T>> {
  try {
    // ✅ Validación opcional con Zod
    if (schema) {
      const toValidate = args[argIndex];
      const parsed = await schema.safeParseAsync(toValidate);

      if (!parsed.success) {
        const formatted = z.treeifyError(parsed.error)
          ? z.treeifyError(parsed.error)
          : parsed.error.issues;

        Debug.warn(scope, "Zod validation failed", formatted);

        return {
          ok: false,
          error: "Validation error",
          details: formatted,
        };
      }

      // Reemplazamos el argumento validado con la versión parseada
      args = [...args];
      args[argIndex] = parsed.data;
    }

    const result = await fn(...args);
    Debug.log(scope, "Service executed successfully");
    return { ok: true, data: result as T };
  } catch (err: any) {
    Debug.error(scope, "Service error", err);
    const message = err?.message ?? "Internal error";
    return { ok: false, error: message };
  }
}
