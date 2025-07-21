import { Schema, model, models } from "mongoose"
import type { IStudent } from "@/types/student"

const nameSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { _id: false },
)

const addressSchema = new Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
)

const studentSchema = new Schema<IStudent>(
  {
    name: { type: nameSchema, required: true },
    profileImageUrl: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    hobbies: [{ type: String }],
    skills: [{ type: String }],
    achievements: [{ type: String }],
    studentId: { type: String, required: true, unique: true },
    isPermanentId: { type: Boolean, default: false },
    idConversionDate: { type: Date },
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
    bedNo: { type: Number },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    admissionYear: { type: String, required: true },
    schoolRollNo: { type: Number, required: true },
    standard: { type: Number, required: true },
    medium: {
      type: String,
      enum: ["Gujarati", "English", "Hindi"],
      required: true,
    },
    lastSchool: { type: String, required: true },
    lastExamGiven: { type: String, required: true },
    lastExamPercentage: { type: Number, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "-"],
    },
    illnesses: [{ type: String }],
    allergies: [{ type: String }],
    fatherName: { type: nameSchema, required: true },
    fatherMobileNumber: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    motherName: { type: nameSchema },
    motherMobileNumber: { type: String },
    motherOccupation: { type: String },
    address: { type: addressSchema, required: true },
    nativePlace: { type: String, required: true },
    admissionDate: { type: Date, required: true },
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
studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})

export const Student = models.Student || model<IStudent>("Student", studentSchema)
