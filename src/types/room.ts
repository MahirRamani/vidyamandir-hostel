import type { Document, Schema } from "mongoose"

export interface IRoom extends Document {
  _id: string
  number: string
  capacity: number
  buildingId: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface RoomFormData {
  number: string
  capacity: number
  buildingId: string
}

export interface RoomWithStudents extends IRoom {
  students: Array<{
    _id: string
    enquiryId: string
    name: {
      firstName: string
      middleName: string
      lastName: string
    }
    studentId: string
    bedNo?: number
  }>
  occupiedBeds: number
}
