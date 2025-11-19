// src/services/public/LandingServices/createRequest.ts
import { RequestsModel } from "@models/Requests";
import { handleService } from "@utils/serviceHelper";
import { z } from "zod";
import { Types } from "mongoose";

/**
 * Ahora se espera:
 * - userId: string (ObjectId en string)
 * - service: string  (nombre)
 * - target: string   (nombre del tipo)
 * - description: string
 */
const createRequestSchema = z.object({
  userId: z.string().min(5, "userId inválido"),
  service: z.string().min(2, "service inválido"),
  target: z.string().min(2, "target inválido"),
  description: z.string().min(5, "La descripción es demasiado corta"),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const createRequest = async (params: CreateRequestInput) =>
  handleService(
    "LandingService.createRequest",
    async (validated) => {
      // convertimos only userId a ObjectId; service/target se guardan como texto
      const newRequest = await RequestsModel.create({
        userId: new Types.ObjectId(validated.userId),
        service: validated.service,
        target: validated.target,
        description: validated.description,
        status: "pendiente",
      });

      return {
        _id: newRequest._id,
        userId: newRequest.userId,
        service: newRequest.service,
        target: newRequest.target,
        description: newRequest.description,
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      };
    },
    [params],
    createRequestSchema
  );
