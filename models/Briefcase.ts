import mongoose, { Schema, Document } from "mongoose";

export interface Jewel extends Document {
  id: string;
  name: string;
  price: number;
  purchase_price: number;
}

export interface IBriefcase extends Document {
  owner_id: string;
  owner_name: string;
  jewels: Jewel[] | [];
}

export const BriefcaseSchema: Schema = new Schema(
  {
    owner_id: { type: String, required: true },
    owner_name: { type: String, required: true },
    jewels: [],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Briefcase ||
  mongoose.model<IBriefcase>("Briefcase", BriefcaseSchema);
