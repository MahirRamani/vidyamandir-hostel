import type { Schema } from "mongoose"

export interface IStudent {
  _id: string
  name: {
    firstName: string
    middleName: string
    lastName: string
  }
  profileImageUrl: string
  dateOfBirth: Date
  hobbies: string[]
  skills: string[]
  achievements: string[]
  enquiryId: string
  studentId: string
  isPermanentId: boolean
  idConversionDate: Date
  roomId: string | null
  bedNo: number
  departmentId: string | null
  admissionYear: string
  schoolRollNo: number
  standard: number
  medium: "Gujarati" | "English" | "Hindi"
  lastSchool: string
  lastExamGiven: string
  lastExamPercentage: number
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "-"
  illnesses: string[]
  allergies: string[]
  fatherName: {
    firstName: string
    middleName: string
    lastName: string
  }
  fatherMobileNumber: string
  fatherOccupation: string
  motherName: {
    firstName: string
    middleName: string
    lastName: string
  }
  motherMobileNumber: string
  motherOccupation: string
  address: {
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  nativePlace: string
  admissionDate: Date
  leavingDate: Date
  nocDate: Date
  status: "Pending" | "Tested" | "Active" | "NOC" | "NOC-Cancel"
  isSatsangi: boolean
  yearsOfSatsang: number
}

export interface StudentFormData {
  basicInfo: {
    name: {
      firstName: string
      middleName: string
      lastName: string
    }
    profileImageUrl: string
    dateOfBirth: Date
    studentId: string
    isPermanentId: boolean
    hobbies: string[]
    skills: string[]
    achievements: string[]
    status: "Pending" | "Tested" | "Active" | "NOC" | "NOC-Cancel"
    isSatsangi: boolean
    yearsOfSatsang?: number
  }
  familyInfo: {
    fatherName: {
      firstName: string
      middleName: string
      lastName: string
    }
    fatherMobileNumber: string
    fatherOccupation: string
    motherName?: {
      firstName: string
      middleName: string
      lastName: string
    }
    motherMobileNumber?: string
    motherOccupation?: string
    address: {
      address: string
      city: string
      state: string
      pinCode: string
      country: string
    }
    nativePlace: string
  }
  healthInfo: {
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-"
    illnesses: string[]
    allergies: string[]
  }
  academicInfo: {
    admissionYear: string
    schoolRollNo: number
    standard: number
    medium: "Gujarati" | "Hindi" | "English"
    lastSchool: string
    lastExamGiven: string
    lastExamPercentage: number
    admissionDate: Date
  }
}
