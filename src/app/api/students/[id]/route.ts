import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import { Student } from "@/models/Student"
import { withErrorHandling } from "@/lib/middleware/validation"

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()

  const { id } = await params

  const student = await Student.findById(id)

  if (!student) {
    return NextResponse.json(
      {
        success: false,
        error: "Student not found",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: student,
  })
})

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()

  const { id } = await params

  const body = await req.json()

  const student = await Student.findByIdAndUpdate(id, body, { new: true, runValidators: true })

  if (!student) {
    return NextResponse.json(
      {
        success: false,
        error: "Student not found",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: student,
    message: "Student updated successfully",
  })
})

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()

  const { id } = await params

  const student = await Student.findByIdAndDelete(id)

  if (!student) {
    return NextResponse.json(
      {
        success: false,
        error: "Student not found",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    message: "Student deleted successfully",
  })
})
