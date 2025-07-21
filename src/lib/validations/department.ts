import { z } from "zod"

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  HOD: z.string().optional(),
  subHOD: z.string().optional(),
  description: z.string().min(1, "Description is required"),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>
