import type { Document } from "mongoose"

export interface IRoom extends Document {
  _id: string
  number: string
  capacity: number
  buildingId: string
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
    name: {
      firstName: string
      middleName: string
      lastName: string
    }
    studentId: string
    profileImageUrl: string
    bedNo?: number
  }>
  occupiedBeds: number
}
