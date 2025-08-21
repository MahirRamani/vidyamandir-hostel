"use client"

import type React from "react"
import { useState, useRef } from "react"
import { MoreHorizontal, Users, Crown, UserCheck, Edit, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StudentProfileTile } from "@/components/student/student-profile-tile"
import { useDepartmentStore } from "@/store/department-store"
import type { IDepartment } from "@/types/department"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmationDialog } from "../dialogs/confirmation-dialog"

interface DepartmentTabProps {
  department: IDepartment
  onEdit: (department: IDepartment) => void
  onDelete: (department: IDepartment) => void
  onStudentDrop: (student: IStudent, department: IDepartment) => void
  onStudentRemove: (student: IStudent, department: IDepartment) => void
}

export function DepartmentTab({ department, onEdit, onDelete, onStudentDrop, onStudentRemove }: DepartmentTabProps) {
  const { students, departments } = useDepartmentStore()
  // const { students } = useDepartmentStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedStudent, setDraggedStudent] = useState<IStudent | null>(null)
  const [dropZoneActive, setDropZoneActive] = useState(false)
  const dragCounterRef = useRef<number>(0)

  // Add confirmation dialog state for student removal
  const [removeDialog, setRemoveDialog] = useState<{
    open: boolean
    student: IStudent | null
  }>({ open: false, student: null })

  const handleRemoveStudent = async () => {
    if (!removeDialog.student) return

    await onStudentRemove(removeDialog.student, department)
    setRemoveDialog({ open: false, student: null })
  }

  // // Filter students assigned to this department
  // // const departmentStudents = students.filter((student) => student.departmentId?.toString() === department._id)
  // const departmentStudents = students
  //   .filter((student) => student.departmentId?.toString() === department._id)
  //   .sort((a, b) => b.standard - a.standard);

  // Updated filtering logic in DepartmentTab component

  // // Filter students assigned to this department (updated for multiple departments)
  // const departmentStudents = students
  //   .filter((student) => {
  //     // Check both old and new department assignment formats
  //     const studentDepartmentIds = student.departmentIds || (student.departmentId ? [student.departmentId] : [])
  //     return studentDepartmentIds.includes(department._id)
  //   })
  //   .sort((a, b) => b.standard - a.standard)

  const departmentStudents = students
  .filter((student) => {
    // Check both old and new department assignment formats
    const studentDepartmentIds = student.departmentIds || (student.departmentId ? [student.departmentId] : [])
    return studentDepartmentIds.some(deptId => deptId?.toString() === department._id?.toString())
  })
  .sort((a, b) => b.standard - a.standard)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounterRef.current++

    if (dragCounterRef.current === 1) {
      setIsDragOver(true)
      setDropZoneActive(true)

      // Parse dragged student data for preview
      try {
        const studentData = e.dataTransfer.getData("application/json")
        if (studentData) {
          const student = JSON.parse(studentData)
          setDraggedStudent(student)
        }
      } catch (error) {
        // Silently handle parsing errors
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounterRef.current--

    if (dragCounterRef.current === 0) {
      setIsDragOver(false)
      setDropZoneActive(false)
      setDraggedStudent(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   dragCounterRef.current = 0
  //   setIsDragOver(false)
  //   setDropZoneActive(false)
  //   setDraggedStudent(null)

  //   const studentData = e.dataTransfer.getData("application/json")
  //   if (studentData) {
  //     try {
  //       const student = JSON.parse(studentData)

  //       // Check if student is already assigned to this department
  //       if (student.departmentId === department._id) {
  //         toast.error("Student is already assigned to this department")
  //         return
  //       }

  //       // Only allow dropping unassigned students
  //       if (student.departmentId) {
  //         toast.error("Student is already assigned to another department")
  //         return
  //       }

  //       onStudentDrop(student, department)
  //     } catch (error) {
  //       console.error("Error parsing dropped student data:", error)
  //       toast.error("Failed to assign student")
  //     }
  //   }
  // }
  // Updated handleDrop function
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounterRef.current = 0
    setIsDragOver(false)
    setDropZoneActive(false)
    setDraggedStudent(null)

    const studentData = e.dataTransfer.getData("application/json")
    if (studentData) {
      try {
        const student = JSON.parse(studentData)

        // Check if student is already assigned to this department
        const studentDepartmentIds = student.departmentIds || (student.departmentId ? [student.departmentId] : [])
        if (studentDepartmentIds.includes(department._id)) {
          toast.error("Student is already assigned to this department")
          return
        }

        // Allow dropping both unassigned students and students from other departments
        onStudentDrop(student, department)
      } catch (error) {
        console.error("Error parsing dropped student data:", error)
        toast.error("Failed to assign student")
      }
    }
  }

  return (
    <div
      className={cn(
        "h-full p-3 transition-all duration-300 min-h-[600px] relative",
        isDragOver && dropZoneActive && "bg-gradient-to-br from-blue-50/70 to-purple-50/70"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Enhanced Drop Zone Overlay */}
      {/* {dropZoneActive && (
        <div className="absolute inset-6 bg-gradient-to-br from-blue-100/90 to-purple-100/90 rounded-2xl border-3 border-blue-400 border-dashed backdrop-blur-sm z-20 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="text-blue-700 text-2xl font-bold mb-2">
              Drop student here
            </div>
            <div className="text-blue-600 text-lg">
              Assign to {department.name}
            </div>
            <div className="text-blue-500 text-sm mt-2">
              {departmentStudents.length} students currently assigned
            </div>
          </div>
        </div>
      )} */}

      {dropZoneActive && (
        <div className="absolute inset-6 bg-gradient-to-br from-blue-100/90 to-purple-100/90 rounded-2xl border-3 border-blue-400 border-dashed backdrop-blur-sm z-20 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div className="text-blue-700 text-2xl font-bold mb-2">
              Drop student here
            </div>
            <div className="text-blue-600 text-lg">
              {draggedStudent && draggedStudent.departmentIds && draggedStudent.departmentIds.length > 0
                ? `Add to ${department.name}`
                : `Assign to ${department.name}`
              }
            </div>
            <div className="text-blue-500 text-sm mt-2">
              {departmentStudents.length} students currently assigned
            </div>
          </div>
        </div>
      )}

      {/* Floating Preview */}
      {isDragOver && draggedStudent && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-blue-300 p-4">
            <div className="text-center mb-3">
              <div className="text-blue-600 text-sm font-semibold">
                Assigning to {department.name}
              </div>
            </div>
            <div className="scale-90 opacity-90">
              <StudentProfileTile
                student={draggedStudent}
                departments={departments}
                className="border-blue-300 bg-blue-50 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Department Header */}
      <div className={cn(
        "flex items-center justify-between mb-3 transition-opacity duration-300",
        isDragOver && dropZoneActive && "opacity-60"
      )}>
        <div>
          <div className="flex items-center gap-3 mb-0">
            <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
            {/* <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Users className="h-3 w-3" />
              {departmentStudents.length} Students
            </Badge> */}
            
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Users className="h-3 w-3" />
              {departmentStudents.length} Students
            </Badge>
          </div>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(department)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Department
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(department)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Department
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className={cn(
        "transition-opacity duration-300 relative",
        isDragOver && dropZoneActive && "opacity-60"
      )}>
        {/* Department Students */}
        <div>


          {departmentStudents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentStudents.map((student) => (
                  <div
                    key={student._id}
                    className="transform hover:scale-102 transition-transform duration-200 relative group"
                  >
                    <StudentProfileTile
                      student={student}
                      departments={departments}
                      className="border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-shadow duration-200"
                    />

                    {/* Remove Button - appears on hover */}
                    <button
                      onClick={() => setRemoveDialog({ open: true, student })}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                      title={`Remove ${student.name.firstName} from ${department.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Remove Student Confirmation Dialog */}
              <ConfirmationDialog
                open={removeDialog.open}
                onOpenChange={(open) => setRemoveDialog({ open, student: null })}
                title="Remove Student from Department"
                description={
                  removeDialog.student
                    ? `Are you sure you want to remove ${removeDialog.student.name.firstName} ${removeDialog.student.name.lastName} from ${department.name}? The student will become unassigned and available for assignment to other departments.`
                    : ""
                }
                confirmText="Remove"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleRemoveStudent}
              />
            </>
          ) : (
            <div className="text-center py-16 border-3 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-300">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-600 mb-2">No students assigned to this department</p>
              <p className="text-gray-500 max-w-md mx-auto">
                Drag unassigned students from the left panel to assign them to this department
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}