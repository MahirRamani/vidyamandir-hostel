import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import { Department } from "@/models/Department"
import { withValidation, withErrorHandling } from "@/lib/middleware/validation"
import { departmentSchema } from "@/lib/validations/department"

export const GET = withErrorHandling(async (req: NextRequest) => {
  await connectDB()

  const departments = await Department.find({})
    .populate("HOD", "name studentId profileImageUrl")
    .populate("subHOD", "name studentId profileImageUrl")
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({
    success: true,
    data: departments,
  })
})

export const POST = withValidation(departmentSchema)(
  withErrorHandling(async (req: NextRequest, validatedData: any) => {
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
    await department.populate("HOD", "name studentId profileImageUrl")
    await department.populate("subHOD", "name studentId profileImageUrl")

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



// import { type NextRequest, NextResponse } from "next/server"
// import connectDB from "@/lib/db/connection"
// import { Department } from "@/models/Department"
// import { Student } from "@/models/Student"
// import { withValidation, withErrorHandling } from "@/lib/middleware/validation"
// import { departmentSchema } from "@/lib/validations/department"
// import mongoose from "mongoose"

// export const GET = withErrorHandling(async (req: NextRequest) => {
//   await connectDB()

//   const departments = await Department.find({})
//     .populate("HOD", "name studentId profileImageUrl")
//     .populate("subHOD", "name studentId profileImageUrl")
//     .sort({ createdAt: -1 })
//     .lean()

//   return NextResponse.json({
//     success: true,
//     data: departments,
//   })
// })

// export const POST = withValidation(departmentSchema)(
//   withErrorHandling(async (req: NextRequest, validatedData: any) => {
//     await connectDB()

//     // Check if department name already exists
//     const existingDepartment = await Department.findOne({ name: validatedData.name })
//     if (existingDepartment) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Department name already exists",
//         },
//         { status: 400 },
//       )
//     }

//     // Validate HOD and Sub HOD exist if provided
//     if (validatedData.HOD && validatedData.HOD !== "none") {
//       const hodExists = await Student.findById(validatedData.HOD)
//       if (!hodExists) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Selected HOD student not found",
//           },
//           { status: 400 },
//         )
//       }
//     }

//     if (validatedData.subHOD && validatedData.subHOD !== "none") {
//       const subHodExists = await Student.findById(validatedData.subHOD)
//       if (!subHodExists) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Selected Sub HOD student not found",
//           },
//           { status: 400 },
//         )
//       }
//     }

//     // Ensure HOD and Sub HOD are different
//     if (
//       validatedData.HOD &&
//       validatedData.subHOD &&
//       validatedData.HOD !== "none" &&
//       validatedData.subHOD !== "none" &&
//       validatedData.HOD === validatedData.subHOD
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "HOD and Sub HOD cannot be the same student",
//         },
//         { status: 400 },
//       )
//     }

//     // Convert ObjectId strings and handle "none" values
//     const departmentData = {
//       ...validatedData,
//       HOD:
//         validatedData.HOD && validatedData.HOD !== "none" ? new mongoose.Types.ObjectId(validatedData.HOD) : undefined,
//       subHOD:
//         validatedData.subHOD && validatedData.subHOD !== "none"
//           ? new mongoose.Types.ObjectId(validatedData.subHOD)
//           : undefined,
//     }

//     const department = new Department(departmentData)
//     await department.save()

//     // Populate the created department before returning
//     await department.populate("HOD", "name studentId profileImageUrl")
//     await department.populate("subHOD", "name studentId profileImageUrl")

//     return NextResponse.json(
//       {
//         success: true,
//         data: department,
//         message: "Department created successfully",
//       },
//       { status: 201 },
//     )
//   }),
// )
