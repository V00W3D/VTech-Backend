import { Schema, model, Document, Types } from "mongoose";

// ==========================
// 🎭 ENUMS
// ==========================
export const ROLE_NAMES = ["Admin", "Cliente"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

// ==========================
// 📜 INTERFACES
// ==========================
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  userImg?: string;
  role: RoleName;
  deleted: boolean;
  active: boolean;
  requests: Types.ObjectId[]; // 🧩 historial de solicitudes
}

// ==========================
// 🧱 SCHEMA
// ==========================
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userImg: { type: String },
    role: { type: String, enum: ROLE_NAMES, default: "Cliente" },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Requests",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const UsersModel = model<IUser>("Users", UserSchema);
