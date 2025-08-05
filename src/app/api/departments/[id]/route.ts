import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../../../connection"
import { Department } from "@/models/Department"
import { Student } from "@/models/Student"
import { withErrorHandling } from "@/lib/middleware/validation"
import mongoose from "mongoose"

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB()

  const department = await Department.findById(params.id)
    .populate("HOD", "name studentId profileImageUrl")
    .populate("subHOD", "name studentId profileImageUrl")

  if (!department) {
    return NextResponse.json(
      {
        success: false,
        error: "Department not found",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: department,
  })
})

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB()

  const body = await req.json()

  // Validate HOD and Sub HOD exist if provided and belong to this department
  if (body.HOD && body.HOD !== "none") {
    const hodExists = await Student.findOne({
      _id: body.HOD,
      departmentId: params.id,
    })
    if (!hodExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected HOD student not found in this department",
        },
        { status: 400 },
      )
    }
  }

  if (body.subHOD && body.subHOD !== "none") {
    const subHodExists = await Student.findOne({
      _id: body.subHOD,
      departmentId: params.id,
    })
    if (!subHodExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected Sub HOD student not found in this department",
        },
        { status: 400 },
      )
    }
  }

  // Ensure HOD and Sub HOD are different
  if (body.HOD && body.subHOD && body.HOD !== "none" && body.subHOD !== "none" && body.HOD === body.subHOD) {
    return NextResponse.json(
      {
        success: false,
        error: "HOD and Sub HOD cannot be the same student",
      },
      { status: 400 },
    )
  }

  // Convert ObjectId strings and handle "none" values
  const updateData = {
    ...body,
    HOD: body.HOD && body.HOD !== "none" ? new mongoose.Types.ObjectId(body.HOD) : null,
    subHOD: body.subHOD && body.subHOD !== "none" ? new mongoose.Types.ObjectId(body.subHOD) : null,
  }

  const department = await Department.findByIdAndUpdate(params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("HOD", "name studentId profileImageUrl")
    .populate("subHOD", "name studentId profileImageUrl")

  if (!department) {
    return NextResponse.json(
      {
        success: false,
        error: "Department not found",
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: department,
    message: "Department updated successfully",
  })
})

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connectDB()

  // Start a transaction to ensure data consistency
  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      // First, release all students from this department
      await Student.updateMany({ departmentId: params.id }, { $unset: { departmentId: 1 } }, { session })

      // Then delete the department
      const department = await Department.findByIdAndDelete(params.id, { session })

      if (!department) {
        throw new Error("Department not found")
      }
    })

    return NextResponse.json({
      success: true,
      message: "Department deleted successfully and all students released",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete department",
      },
      { status: 400 },
    )
  } finally {
    await session.endSession()
  }
})