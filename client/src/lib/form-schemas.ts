import { z } from "zod";

// Entry form schema
export const entryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be 50 characters or less" }),
  description: z.string().optional(),
  is_public: z.boolean().default(true),
});
export type EntryFormValues = z.infer<typeof entryFormSchema>;

// View form schema
export const viewFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must be 50 characters or less" }),
  description: z.string().min(1, { message: "Description is required" }),
  mvsj: z.record(z.any()).optional().nullable(),
});
export type ViewFormValues = z.infer<typeof viewFormSchema>;
