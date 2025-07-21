import type { Document, Schema } from "mongoose"

export interface IDepartment extends Document {
  _id: string
  name: string
  HOD?: Schema.Types.ObjectId | string
  subHOD?: Schema.Types.ObjectId | string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface DepartmentFormData {
  name: string
  HOD?: string
  subHOD?: string
  description: string
}

export interface PopulatedDepartment extends Omit<IDepartment, "HOD" | "subHOD"> {
  HOD?: {
    _id: string
    name: {
      firstName: string
      middleName: string
      lastName: string
    }
    studentId: string
    profileImageUrl: string
  }
  subHOD?: {
    _id: string
    name: {
      firstName: string
      middleName: string
      lastName: string
    }
    studentId: string
    profileImageUrl: string
  }
}


// import type { Document, Schema } from "mongoose"

// export interface IDepartment extends Document {
//   name: string
//   HOD?: Schema.Types.ObjectId | string
//   subHOD?: Schema.Types.ObjectId | string
//   description: string
// }

// export interface DepartmentFormData {
//   name: string
//   HOD?: string
//   subHOD?: string
//   description: string
// }
