// src/models/Requests.ts
import { model, Schema, Document, Types } from "mongoose";

export type RequestStatus =
  | "pendiente"
  | "aceptada"
  | "rechazada"
  | "cancelada"
  | "finalizada";

export interface IRequest extends Document {
  userId: Types.ObjectId; // cliente que hace la request
  service: string; // 🔹 nombre del servicio
  target: string; // 🔹 tipo de trabajo
  description: string;
  status: RequestStatus;
  fecha: Date;
  fechaFinalización: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    service: { type: String, required: true }, // 🔹 texto, no ref
    target: { type: String, required: true }, // 🔹 texto, no ref
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "aceptada", "rechazada", "finalizada"],
      default: "pendiente",
    },
    fecha: { type: Date, default: () => new Date() },
    fechaFinalización: { type: Date, default: null },
  },
  { timestamps: true }
);

export const RequestsModel = model<IRequest>("Requests", RequestSchema);
