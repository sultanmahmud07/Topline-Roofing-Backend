import { z } from "zod";

export const createStateSchema = z.object({
    state: z.string().min(1, "State name is required"),
    zip: z.string().optional(),
    type: z.string().min(1, "Type is required")
});

export const updateStateSchema = z.object({
    state: z.string().optional(),
    zip: z.string().optional(),
    type: z.string().optional()
});
