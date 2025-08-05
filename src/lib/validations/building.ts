import { z } from "zod"

export const buildingSchema = z.object({
  name: z.string().min(2, "Building name is required"),
  description: z.string().optional(),
})

export type BuildingFormData = z.infer<typeof buildingSchema>
