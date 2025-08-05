"use client"

import { Search, Filter, Users } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
import { useDepartmentStore } from "@/store/department-store"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"

interface StudentPanelProps {
  onStudentDragStart: (student: IStudent) => void
}

export function StudentPanel({ onStudentDragStart }: StudentPanelProps) {
  const { students, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
    useDepartmentStore()

  const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null)

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchQuery ||
      student.name.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      assignmentFilter === "all" ||
      (assignmentFilter === "assigned" && student.departmentId) ||
      (assignmentFilter === "unassigned" && !student.departmentId)

    return matchesSearch && matchesFilter
  })

  const handleDragStart = (student: IStudent, e: React.DragEvent) => {
    // Only allow dragging unassigned students
    if (student.departmentId) {
      e.preventDefault()
      return
    }

    e.dataTransfer.setData("application/json", JSON.stringify(student))
    e.dataTransfer.effectAllowed = "move"

    // Create enhanced drag preview
    const dragElement = document.createElement('div')
    dragElement.className = 'pointer-events-none'
    dragElement.innerHTML = `
      <div class="transform rotate-3 scale-110 opacity-95 bg-white rounded-lg border-2 border-blue-500 shadow-2xl p-4 max-w-xs">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            ${student.name.firstName[0]}${student.name.lastName[0]}
          </div>
          <div>
            <div class="font-semibold text-sm text-gray-800">${student.name.firstName} ${student.name.lastName}</div>
            <div class="text-xs text-gray-500">${student.studentId}</div>
          </div>
        </div>
        <div class="text-xs text-blue-600 font-medium text-center bg-blue-50 rounded px-2 py-1">
          Drag to assign to department
        </div>
      </div>
    `

    dragElement.style.position = 'absolute'
    dragElement.style.top = '-1000px'
    dragElement.style.left = '-1000px'
    document.body.appendChild(dragElement)

    e.dataTransfer.setDragImage(dragElement, 150, 75)

    setTimeout(() => {
      document.body.removeChild(dragElement)
    }, 0)

    setDraggedStudentId(student._id)
    onStudentDragStart(student)
  }

  const handleDragEnd = () => {
    setDraggedStudentId(null)
  }

  return (
    <div className="w-80 border-r bg-white h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Students</h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter */}
        <Select value={assignmentFilter} onValueChange={(value: typeof assignmentFilter) => setAssignmentFilter(value)}>
          <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StudentProfileTileSkeleton key={i} />)
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const isDragging = draggedStudentId === student._id
            const canDrag = !student.departmentId
            const isAssigned = !!student.departmentId

            return (
              <div
                key={student._id}
                draggable={canDrag}
                onDragStart={canDrag ? (e) => handleDragStart(student, e) : undefined}
                onDragEnd={canDrag ? handleDragEnd : undefined}
                className={cn(
                  "transition-all duration-300 relative",
                  canDrag ? "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg hover:-translate-y-1" : "cursor-default",
                  isDragging && "opacity-50 scale-95 rotate-2 z-50",
                )}
              >
                <StudentProfileTile
                  student={student}
                  className={cn(
                    "transition-all duration-300",
                    isAssigned ? "border-green-300 bg-green-50 shadow-sm" : "border-gray-200 hover:border-blue-300",
                    isDragging && "shadow-2xl border-blue-500 bg-blue-100",
                    !canDrag && isAssigned && "opacity-90"
                  )}
                  showDepartment
                />

                {/* Assignment Status Indicator */}
                {isAssigned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                )}

                {/* Non-draggable message for assigned students */}
                {isAssigned && (
                  <div className="text-xs text-center text-green-600 mt-1 font-medium">
                    ✓ Already assigned to department
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>
    </div>
  )
}