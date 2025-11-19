import { Schema, model, Document } from "mongoose";

export interface IServiceTarget {
  name: string;
  description?: string;
  icon?: string;
  deleted: boolean;
}

export interface IServiceType extends Document {
  name: string;
  slogan: string;
  shortDescription: string;
  longDescription: string;
  image?: string;
  targets: IServiceTarget[]; // ← ahora es un array embebido
  deleted: boolean;
}

const TargetSchema = new Schema<IServiceTarget>(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { _id: false } // ← importante: evita crear _id interno por cada target
);

const ServiceTypeSchema = new Schema<IServiceType>(
  {
    name: { type: String, required: true, unique: true },
    slogan: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    image: { type: String },

    // 🎯 Targets embebidos directamente
    targets: {
      type: [TargetSchema],
      required: true,
      default: [],
    },

    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ServiceTypesModel = model<IServiceType>(
  "ServiceTypes",
  ServiceTypeSchema
);
