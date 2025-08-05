import { Schema, model, models } from "mongoose"
import type { IBuilding } from "@/types/building"

const buildingSchema = new Schema<IBuilding>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
// buildingSchema.index({ name: 1 })

// Virtual to get rooms count
buildingSchema.virtual("roomsCount", {
  ref: "Room",
  localField: "_id",
  foreignField: "buildingId",
  count: true,
})

export const Building = models.Building || model<IBuilding>("Building", buildingSchema)
