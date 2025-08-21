import { type NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../../connection";
import { Student } from "@/models/Student";
import { Department } from "@/models/Department";
import { withErrorHandling } from "@/lib/middleware/validation";

// PUT /api/students/[id]/departments - Assign multiple departments to student
export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectDB();

    const { id } = await params;
    const { departmentIds } = await req.json();

    // Validate that departmentIds is an array
    if (!Array.isArray(departmentIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "departmentIds must be an array",
        },
        { status: 400 }
      );
    }

    // Validate all departments exist if departmentIds are provided
    if (departmentIds.length > 0) {
      const departments = await Department.find({ _id: { $in: departmentIds } });
      if (departments.length !== departmentIds.length) {
        return NextResponse.json(
          {
            success: false,
            error: "One or more departments not found",
          },
          { status: 404 }
        );
      }
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        departmentIds: departmentIds || [],
        departmentId: departmentIds && departmentIds.length > 0 ? departmentIds[0] : null
      },
      { new: true, runValidators: true }
    ).populate('departmentIds');

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: departmentIds.length > 0 
        ? "Student assigned to departments successfully"
        : "Student removed from all departments successfully",
    });
  }
);



// import { type NextRequest, NextResponse } from "next/server";
// import connectDB from "../../../../../../connection";
// import { Student } from "@/models/Student";
// import { Department } from "@/models/Department";
// import { withErrorHandling } from "@/lib/middleware/validation";

// export const PUT = withErrorHandling(
//   async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
//     await connectDB();

//     const { id } = await params;

//     const { departmentId } = await req.json();

//     // Validate department exists if departmentId is provided
//     if (departmentId) {
//       const department = await Department.findById(departmentId);
//       if (!department) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Department not found",
//           },
//           { status: 404 }
//         );
//       }
//     }

//     const student = await Student.findByIdAndUpdate(
//       id,
//       { departmentId: departmentId || null },
//       { new: true, runValidators: true }
//     );

//     if (!student) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Student not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: student,
//       message: departmentId
//         ? "Student assigned to department successfully"
//         : "Student removed from department successfully",
//     });
//   }
// );
