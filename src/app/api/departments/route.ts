import { type NextRequest, NextResponse } from "next/server"
import connectDB from "../../../../connection"
import { Department } from "@/models/Department"
import { withValidation, withErrorHandling } from "@/lib/middleware/validation"
import { departmentSchema } from "@/lib/validations/department"
import { type z } from "zod"

// Infer the type from your schema
type DepartmentInput = z.infer<typeof departmentSchema>

export const GET = withErrorHandling(async (req: NextRequest) => {
  await connectDB()

  const departments = await Department.find({})
    .populate("HOD", "name studentId")
    .populate("subHOD", "name studentId")
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({
    success: true,
    data: departments,
  })
})

export const POST = withValidation(departmentSchema)(
  withErrorHandling(async (req: NextRequest, validatedData: DepartmentInput) => {
    await connectDB()

    // Check if department name already exists
    const existingDepartment = await Department.findOne({ name: validatedData.name })
    if (existingDepartment) {
      return NextResponse.json(
        {
          success: false,
          error: "Department name already exists",
        },
        { status: 400 },
      )
    }

    // For new department, HOD and subHOD will be set later after students are assigned
    const departmentData = {
      name: validatedData.name,
      description: validatedData.description,
      HOD: undefined,
      subHOD: undefined,
    }

    const department = new Department(departmentData)
    await department.save()

    // Populate the created department before returning
    await department.populate("HOD", "name studentId")
    await department.populate("subHOD", "name studentId")

    return NextResponse.json(
      {
        success: true,
        data: department,
        message: "Department created successfully",
      },
      { status: 201 },
    )
  }),
)
