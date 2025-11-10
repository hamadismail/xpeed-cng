import mongoose, { model, models } from "mongoose";
import { InvoiceData } from "../types";

const logSchema = new mongoose.Schema({
  shifts: {
    a: {
      sale: { type: String, required: true },
      evc: { type: String, required: true },
      diesel: { type: String, required: true },
      octane: { type: String, required: true },
    },
    b: {
      sale: { type: String, required: true },
      evc: { type: String, required: true },
      diesel: { type: String, required: true },
      octane: { type: String, required: true },
    },
    c: {
      sale: { type: String, required: true },
      evc: { type: String, required: true },
      diesel: { type: String, required: true },
      octane: { type: String, required: true },
    },
  },
  dieselClosing: { type: String, required: true },
  octaneClosing: { type: String, required: true },
  lpg: { type: String, required: true },
  lpgClosing: { type: String, required: true },
  dieselOctaneDue: { type: String, required: true },
  date: { type: Date, required: true },
}, { versionKey: false });

// export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
export default models.Logs || model<InvoiceData>('Logs', logSchema);

