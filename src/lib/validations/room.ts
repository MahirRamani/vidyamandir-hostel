import { z } from "zod"

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(20, "Capacity cannot exceed 20"),
  buildingId: z.string().min(1, "Building is required"),
})

export type RoomFormData = z.infer<typeof roomSchema>
