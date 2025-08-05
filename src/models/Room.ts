import { Schema, model, models } from "mongoose"
import type { IRoom } from "@/types/room"

const roomSchema = new Schema<IRoom>(
  {
    number: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1, max: 20 },
    buildingId: { type: Schema.Types.ObjectId, ref: "Building", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Compound index to ensure unique room numbers within a building
// roomSchema.index({ number: 1, buildingId: 1 }, { unique: true })
// roomSchema.index({ buildingId: 1 })

// Virtual to get students in this room
// roomSchema.virtual("students", {
//   ref: "Student",
//   localField: "_id",
//   foreignField: "roomId",
// })

export const Room = models.Room || model<IRoom>("Room", roomSchema)
