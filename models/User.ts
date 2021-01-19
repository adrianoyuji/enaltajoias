import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  REVENDEDOR = "REVENDEDOR",
}

export interface Jewel extends Document {
  id: string;
  name: string;
  price: number;
}

export interface Briefcase extends Document {
  owner_id: string;
  owner_name: string;
  jewels: Jewel[] | [];
}

export interface IUser extends Document {
  email: string;
  full_name: string;
  role: Role;
  password: string;
  city: string;
  phone_number: string;
  briefcases: Briefcase[] | [];
}

export const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    full_name: { type: String, required: true, trim: true },
    city: { type: String },
    createdAt: { type: Date, default: Date.now },
    password: { type: String },
    phone_number: { type: String },
    briefcases: [],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
