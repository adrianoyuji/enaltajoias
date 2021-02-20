import mongoose, { Schema, Document } from "mongoose";

export interface Jewel extends Document {
  id: string;
  name: string;
  price: number;
  purchase_price: number;
}

export interface IBriefcase extends Document {
  briefcase_name: string;
  jewels: Jewel[] | [];
  jewel_quantity: number;
  total_value: number;
}

export const BriefcaseSchema: Schema = new Schema(
  {
    briefcase_name: { type: String, required: true },
    jewels: [{ jewelId: { type: String, required: true } }],
    jewel_quantity: { type: Number },
    total_value: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Briefcase ||
  mongoose.model<IBriefcase>("Briefcase", BriefcaseSchema);
