import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import { Student } from "@/models/Student"
import { withValidation, withErrorHandling } from "@/lib/middleware/validation"
import { completeStudentSchema } from "@/lib/validations/student"

export const GET = withErrorHandling(async (req: NextRequest) => {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  const skip = (page - 1) * limit

  // Build query
  const query: any = {}

  if (search) {
    query.$or = [
      { "name.firstName": { $regex: search, $options: "i" } },
      { "name.lastName": { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
      { schoolRollNo: Number.parseInt(search) || 0 },
    ]
  }

  if (status && status !== "all") {
    query.status = status
  }

  const [students, total] = await Promise.all([
    Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Student.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    success: true,
    data: {
      students,
      total,
      page,
      totalPages,
    },
  })
})

export const POST = withValidation(completeStudentSchema)(
  withErrorHandling(async (req: NextRequest, validatedData: any) => {
    await connectDB()

    // Transform the nested form data to flat structure for MongoDB
    const studentData = {
      ...validatedData.basicInfo,
      ...validatedData.familyInfo,
      ...validatedData.healthInfo,
      ...validatedData.academicInfo,
    }

    // Check if student ID already exists
    const existingStudent = await Student.findOne({ studentId: studentData.studentId })
    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID already exists",
        },
        { status: 400 },
      )
    }

    const student = new Student(studentData)
    await student.save()

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: "Student registered successfully",
      },
      { status: 201 },
    )
  }),
)
