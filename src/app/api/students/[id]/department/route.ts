import { type NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../../connection";
import { Student } from "@/models/Student";
import { Department } from "@/models/Department";
import { withErrorHandling } from "@/lib/middleware/validation";

export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectDB();

    const { id } = await params;

    const { departmentId } = await req.json();

    // Validate department exists if departmentId is provided
    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return NextResponse.json(
          {
            success: false,
            error: "Department not found",
          },
          { status: 404 }
        );
      }
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { departmentId: departmentId || null },
      { new: true, runValidators: true }
    );

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
      message: departmentId
        ? "Student assigned to department successfully"
        : "Student removed from department successfully",
    });
  }
);
