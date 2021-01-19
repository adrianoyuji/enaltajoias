import mongoose, { Schema, Document } from "mongoose";

export interface IJewel extends Document {
  jewelId: number;
  name: string;
  line: string;
  type: string;
  price: number;
}

export const JewelSchema: Schema = new Schema(
  {
    jewelId: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    line: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Jewel ||
  mongoose.model<IJewel>("Jewel", JewelSchema);
