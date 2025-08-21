import { Schema, model, models } from "mongoose"
import type { IStudent } from "@/types/student"

const nameSchema = new Schema(
  {
    firstName: { type: String, },
    middleName: { type: String, },
    lastName: { type: String, },
  },
  { _id: false },
)

const addressSchema = new Schema(
  {
    address: { type: String, },
    city: { type: String, },
    state: { type: String, },
    pincode: { type: String, },
    country: { type: String, },
  },
  { _id: false },
)

const studentSchema = new Schema<IStudent>(
  {
    name: { type: nameSchema, },
    dateOfBirth: { type: Date, },
    hobbies: [{ type: String }],
    skills: [{ type: String }],
    achievements: [{ type: String }],
    enquiryId: { type: String, unique: true },
    studentId: { type: String, unique: true },
    isPermanentId: { type: Boolean, default: false },
    idConversionDate: { type: Date },
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
    bedNo: { type: Number },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    departmentIds: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    admissionYear: { type: String, },
    schoolRollNo: { type: Number, },
    standard: { type: Number, },
    medium: {
      type: String,
      enum: ["Gujarati", "English", "Hindi"],
    },
    lastSchool: { type: String, },
    lastExamGiven: { type: String, },
    lastExamPercentage: { type: Number, },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "-"],
    },
    illnesses: [{ type: String }],
    allergies: [{ type: String }],
    fatherName: { type: nameSchema, },
    fatherMobileNumber: { type: String, },
    fatherOccupation: { type: String, },
    motherName: { type: nameSchema },
    motherMobileNumber: { type: String },
    motherOccupation: { type: String },
    address: { type: addressSchema, },
    nativePlace: { type: String, },
    admissionDate: { type: Date, },
    leavingDate: { type: Date },
    nocDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Tested", "Active", "NOC", "NOC-Cancel"],
      default: "Pending",
    },
    isSatsangi: { type: Boolean, default: false },
    yearsOfSatsang: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better performance
// studentSchema.index({ studentId: 1 })
// studentSchema.index({ status: 1 })
// studentSchema.index({ "name.firstName": "text", "name.lastName": "text" })
// studentSchema.index({ schoolRollNo: 1 })

// Virtual for full name
// studentSchema.virtual("fullName").get(function () {
//   return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
// })

export const Student = models.Student || model<IStudent>("Student", studentSchema)
