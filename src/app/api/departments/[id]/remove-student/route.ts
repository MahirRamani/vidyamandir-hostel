// API endpoint: /api/departments/[id]/remove-student/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../../../../connection"
import { Department } from "@/models/Department"
import { Student } from "@/models/Student"
import { withErrorHandling } from "@/lib/middleware/validation"
import mongoose from "mongoose"

export const POST = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB()

  const body = await req.json()
  const { studentId } = body

  if (!studentId) {
    return NextResponse.json(
      {
        success: false,
        error: "Student ID is required",
      },
      { status: 400 },
    )
  }

  // Start a transaction to ensure data consistency
  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      // Check if the department exists
      const department = await Department.findById(params.id).session(session)
      if (!department) {
        throw new Error("Department not found")
      }

      // Check if the student exists and is in this department
      const student = await Student.findOne({
        _id: studentId,
        departmentId: params.id,
      }).session(session)

      if (!student) {
        throw new Error("Student not found in this department")
      }

      // Remove student from department
      await Student.findByIdAndUpdate(
        studentId,
        { $unset: { departmentId: 1 } },
        { session }
      )

      // If the student was HOD or subHOD, remove them from those positions
      const updateFields: any = {}
      if (department.HOD && department.HOD.toString() === studentId) {
        updateFields.HOD = null
      }
      if (department.subHOD && department.subHOD.toString() === studentId) {
        updateFields.subHOD = null
      }

      if (Object.keys(updateFields).length > 0) {
        await Department.findByIdAndUpdate(params.id, updateFields, { session })
      }
    })

    // Fetch the updated department with populated fields
    const updatedDepartment = await Department.findById(params.id)
      .populate("HOD", "name studentId")
      .populate("subHOD", "name studentId")

    return NextResponse.json({
      success: true,
      data: updatedDepartment,
      message: "Student removed from department successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to remove student from department",
      },
      { status: 400 },
    )
  } finally {
    await session.endSession()
  }
})