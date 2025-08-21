import { type NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../../../connection";
import { Student } from "@/models/Student";
import { Department } from "@/models/Department";
import { withErrorHandling } from "@/lib/middleware/validation";

// POST /api/students/[id]/departments/[departmentId] - Add student to additional department
export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string; departmentId: string }> }) => {
    await connectDB();

    const resolvedParams = await params;
    const { id: studentId, departmentId } = resolvedParams;

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    // Check if department exists
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

    // Add department if not already assigned
    const currentDepartmentIds = student.departmentIds || [];
    const departmentIdStr = departmentId.toString();
    
    if (!currentDepartmentIds.some((id: { toString: () => string; }) => id.toString() === departmentIdStr)) {
      currentDepartmentIds.push(departmentId);

      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
          departmentIds: currentDepartmentIds,
          departmentId: student.departmentId || departmentId // Set primary if none exists
        },
        { new: true, runValidators: true }
      ).populate('departmentIds');

      return NextResponse.json({
        success: true,
        data: updatedStudent,
        message: "Student added to department successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Student is already assigned to this department",
        },
        { status: 400 }
      );
    }
  }
);

// DELETE /api/students/[id]/departments/[departmentId] - Remove student from specific department
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string; departmentId: string }> }) => {
    await connectDB();

    const resolvedParams = await params;
    const { id: studentId, departmentId } = resolvedParams;

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    // Remove department from student's assignments
    const currentDepartmentIds = student.departmentIds || [];
    const updatedDepartmentIds = currentDepartmentIds.filter(
      (      id: { toString: () => string; }) => id.toString() !== departmentId.toString()
    );

    // Update primary department if it was removed
    let newPrimaryDepartment = student.departmentId;
    if (student.departmentId && student.departmentId.toString() === departmentId.toString()) {
      newPrimaryDepartment = updatedDepartmentIds.length > 0 ? updatedDepartmentIds[0] : null;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        departmentIds: updatedDepartmentIds,
        departmentId: newPrimaryDepartment
      },
      { new: true, runValidators: true }
    ).populate('departmentIds');

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: "Student removed from department successfully",
    });
  }
);