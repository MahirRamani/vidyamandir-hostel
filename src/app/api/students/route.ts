import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../../connection"
import { Student } from "@/models/Student"
import { withValidation, withErrorHandling } from "@/lib/middleware/validation"
import { completeStudentSchema } from "@/lib/validations/student"
import { FilterQuery } from "mongoose"
import type { IStudent } from "@/types/student"
import type { z } from "zod"

// Infer types from Zod schemas
type CompleteStudentData = z.infer<typeof completeStudentSchema>
type BasicInfo = CompleteStudentData['basicInfo']
type FamilyInfo = CompleteStudentData['familyInfo']
type HealthInfo = CompleteStudentData['healthInfo']
type AcademicInfo = CompleteStudentData['academicInfo']

// Define the query interface for MongoDB
interface StudentQuery extends FilterQuery<IStudent> {
  $or?: Array<{
    "name.firstName"?: { $regex: string; $options: string }
    "name.lastName"?: { $regex: string, $options: string }
    studentId?: { $regex: string; $options: string }
    schoolRollNo?: number
  }>
  status?: IStudent['status']
}

// Transform nested form data to flat MongoDB structure
const flattenStudentData = (data: CompleteStudentData): Partial<IStudent> => ({
  // Basic Info
  name: data.basicInfo.name,
  profileImageUrl: data.basicInfo.profileImageUrl,
  dateOfBirth: data.basicInfo.dateOfBirth,
  studentId: data.basicInfo.studentId,
  isPermanentId: data.basicInfo.isPermanentId,
  hobbies: data.basicInfo.hobbies || [],
  skills: data.basicInfo.skills || [],
  achievements: data.basicInfo.achievements || [],
  status: data.basicInfo.status,
  isSatsangi: data.basicInfo.isSatsangi,
  yearsOfSatsang: data.basicInfo.yearsOfSatsang || 0,

  // Family Info
  fatherName: data.familyInfo.fatherName,
  fatherMobileNumber: data.familyInfo.fatherMobileNumber,
  fatherOccupation: data.familyInfo.fatherOccupation,
  motherName: data.familyInfo.motherName || { firstName: "", middleName: "", lastName: "" },
  motherMobileNumber: data.familyInfo.motherMobileNumber || "",
  motherOccupation: data.familyInfo.motherOccupation || "",
  address: {
    address: data.familyInfo.address.address,
    city: data.familyInfo.address.city,
    state: data.familyInfo.address.state,
    pincode: data.familyInfo.address.pinCode, // Note: pinCode vs pincode
    country: data.familyInfo.address.country,
  },
  nativePlace: data.familyInfo.nativePlace,

  // Health Info
  bloodGroup: data.healthInfo.bloodGroup || "-",
  illnesses: data.healthInfo.illnesses || [],
  allergies: data.healthInfo.allergies || [],

  // Academic Info
  admissionYear: data.academicInfo.admissionYear,
  schoolRollNo: data.academicInfo.schoolRollNo,
  standard: data.academicInfo.standard,
  medium: data.academicInfo.medium,
  lastSchool: data.academicInfo.lastSchool,
  lastExamGiven: data.academicInfo.lastExamGiven,
  lastExamPercentage: data.academicInfo.lastExamPercentage,
  admissionDate: data.academicInfo.admissionDate,
})

export const GET = withErrorHandling(async (req: NextRequest) => {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10")))

  const skip = (page - 1) * limit

  // Build search query
  const query: StudentQuery = {}

  if (search.trim()) {
    const searchTerms = search.trim()
    const searchNumber = Number.parseInt(searchTerms)

    query.$or = [
      { "name.firstName": { $regex: searchTerms, $options: "i" } },
      { "name.lastName": { $regex: searchTerms, $options: "i" } },
      { studentId: { $regex: searchTerms, $options: "i" } },
    ]

    // Add numeric search only if valid number
    if (!isNaN(searchNumber) && searchNumber > 0) {
      query.$or.push({ schoolRollNo: searchNumber })
    }
  }

  if (status && status !== "all") {
    const validStatuses: IStudent['status'][] = ["Pending", "Tested", "Active", "NOC", "NOC-Cancel"]
    if (validStatuses.includes(status as IStudent['status'])) {
      query.status = status as IStudent['status']
    }
  }

  try {
    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IStudent[]>()
        .exec(),
      Student.countDocuments(query).exec(),
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        students,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch students",
      },
      { status: 500 }
    )
  }
})

export const POST = withValidation(completeStudentSchema)(
  withErrorHandling(async (req: NextRequest, validatedData: CompleteStudentData) => {
    await connectDB()

    try {
      // Check if student ID already exists
      const existingStudent = await Student.findOne({
        studentId: validatedData.basicInfo.studentId
      }).lean().exec()

      if (existingStudent) {
        return NextResponse.json(
          {
            success: false,
            error: "Student ID already exists",
            field: "studentId",
          },
          { status: 409 } // Conflict status code
        )
      }

      // Check if school roll number already exists for the same admission year
      const existingRollNo = await Student.findOne({
        schoolRollNo: validatedData.academicInfo.schoolRollNo,
        admissionYear: validatedData.academicInfo.admissionYear,
      }).lean().exec()

      if (existingRollNo) {
        return NextResponse.json(
          {
            success: false,
            error: "School roll number already exists for this admission year",
            field: "schoolRollNo",
          },
          { status: 409 }
        )
      }

      // Transform and create student
      const studentData = flattenStudentData(validatedData)
      const student = new Student(studentData)
      await student.save()

      // Return clean response without Mongoose internals
      const savedStudent = student.toObject()

      return NextResponse.json(
        {
          success: true,
          data: savedStudent,
          message: "Student registered successfully",
        },
        { status: 201 }
      )
    } catch (error) {
      console.error("Error creating student:", error)

      // Handle validation errors
      if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: error.message,
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create student",
        },
        { status: 500 }
      )
    }
  })
)