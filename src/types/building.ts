import type { Document } from "mongoose"

export interface IBuilding extends Document {
  _id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface BuildingFormData {
  name: string
  description?: string
}
