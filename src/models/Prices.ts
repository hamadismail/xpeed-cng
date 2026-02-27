import { Schema, model, models } from "mongoose";

export interface IPrices {
  CNG: number;
  DIESEL: number;
  OCTANE: number;
  LPG: number;
  updatedAt: Date;
}

const pricesSchema = new Schema<IPrices>(
  {
    CNG: { type: Number, required: true },
    DIESEL: { type: Number, required: true },
    OCTANE: { type: Number, required: true },
    LPG: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default models.Prices || model<IPrices>("Prices", pricesSchema);
