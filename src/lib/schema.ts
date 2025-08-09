import { z } from "zod";

export const formSchema = z.object({
  shifts: z.object({
    a: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
    }),
    b: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
    }),
    c: z.object({
      sale: z.string().min(1, "Sales is required"),
      evc: z.string().min(1, "Evc is required"),
    }),
  }),
  diesel: z.string().min(1, "diesel is required"),
  octane: z.string().min(1, "octane is required"),
  lpg: z.string().min(1, "lpg is required"),
});
