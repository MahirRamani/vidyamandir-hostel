import { Schema, model, models } from "mongoose"
import type { IDepartment } from "@/types/department"

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true },
    HOD: { type: Schema.Types.ObjectId, ref: "Student" },
    subHOD: { type: Schema.Types.ObjectId, ref: "Student" },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
// departmentSchema.index({ name: 1 })
// departmentSchema.index({ HOD: 1 })
// departmentSchema.index({ subHOD: 1 })

// Virtual to populate HOD student details
// departmentSchema.virtual("hodStudent", {
//   ref: "Student",
//   localField: "HOD",
//   foreignField: "_id",
//   justOne: true,
// })

// Virtual to populate Sub HOD student details
// departmentSchema.virtual("subHodStudent", {
//   ref: "Student",
//   localField: "subHOD",
//   foreignField: "_id",
//   justOne: true,
// })

export const Department = models.Department || model<IDepartment>("Department", departmentSchema)
