"use client"

import { Search, Filter, Users, X } from "lucide-react"
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
  const { students, departments, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
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

  // Calculate counts for different filters
  const totalCount = students.length
  const assignedCount = students.filter(student => student.departmentId).length
  const unassignedCount = students.filter(student => !student.departmentId).length

  // Get current filter count
  const getCurrentFilterCount = () => {
    switch (assignmentFilter) {
      case "assigned":
        return assignedCount
      case "unassigned":
        return unassignedCount
      default:
        return totalCount
    }
  }

  // Get filter display text
  const getFilterDisplayText = () => {
    switch (assignmentFilter) {
      case "assigned":
        return "Assigned Students"
      case "unassigned":
        return "Unassigned Students"
      default:
        return "All Students"
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

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
    <div className="w-85 border-r bg-white h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-2 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        {/* Title with count */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-800">Students</h3>
          <div className="text-sm text-gray-600 bg-white rounded-full px-3 py-1 border">
            <span className="font-medium text-blue-600">{filteredStudents.length}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{getCurrentFilterCount()}</span>
          </div>
        </div>

        {/* Current filter info */}
        {/* <div className="text-xs text-gray-500 mb-2 px-1">
          {getFilterDisplayText()} • Total: {totalCount} | Assigned: {assignedCount} | Unassigned: {unassignedCount}
        </div> */}

        {/* Search */}
        <div className="relative mb-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter */}
        <Select value={assignmentFilter} onValueChange={(value: typeof assignmentFilter) => setAssignmentFilter(value)}>
          <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students ({totalCount})</SelectItem>
            <SelectItem value="assigned">Assigned ({assignedCount})</SelectItem>
            <SelectItem value="unassigned">Unassigned ({unassignedCount})</SelectItem>
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
                  canDrag ? "cursor-grab active:cursor-grabbing hover:scale-102 hover:shadow-lg hover:-translate-y-1" : "cursor-default",
                  isDragging && "opacity-50 scale-95 rotate-2 z-50",
                )}
              >
                <StudentProfileTile
                  student={student}
                  departments={departments}
                  className={cn(
                    "transition-all duration-300",
                    isDragging && "shadow-2xl border-blue-500 bg-blue-100",
                    !canDrag
                  )}
                  showDepartment
                />
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? "No students match your search" : "No students found"}
            </p>
            {/* {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-blue-500 hover:text-blue-700 text-sm mt-2 underline"
              >
                Clear search
              </button>
            )} */}
          </div>
        )}
      </div>
    </div>
  )
}



// "use client"

// import { Search, Filter, Users } from "lucide-react"
// import type React from "react"
// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
// import { useDepartmentStore } from "@/store/department-store"
// import type { IStudent } from "@/types/student"
// import { cn } from "@/lib/utils"

// interface StudentPanelProps {
//   onStudentDragStart: (student: IStudent) => void
// }

// export function StudentPanel({ onStudentDragStart }: StudentPanelProps) {
//   const { students,departments, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
//     useDepartmentStore()

//   const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null)

//   const filteredStudents = students.filter((student) => {
//     const matchesSearch =
//       !searchQuery ||
//       student.name.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       student.name.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       student.studentId.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesFilter =
//       assignmentFilter === "all" ||
//       (assignmentFilter === "assigned" && student.departmentId) ||
//       (assignmentFilter === "unassigned" && !student.departmentId)

//     return matchesSearch && matchesFilter
//   })

//   const handleDragStart = (student: IStudent, e: React.DragEvent) => {
//     // Only allow dragging unassigned students
//     if (student.departmentId) {
//       e.preventDefault()
//       return
//     }

//     e.dataTransfer.setData("application/json", JSON.stringify(student))
//     e.dataTransfer.effectAllowed = "move"

//     // Create enhanced drag preview
//     const dragElement = document.createElement('div')
//     dragElement.className = 'pointer-events-none'
//     dragElement.innerHTML = `
//       <div class="transform rotate-3 scale-110 opacity-95 bg-white rounded-lg border-2 border-blue-500 shadow-2xl p-4 max-w-xs">
//         <div class="flex items-center space-x-3 mb-2">
//           <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
//             ${student.name.firstName[0]}${student.name.lastName[0]}
//           </div>
//           <div>
//             <div class="font-semibold text-sm text-gray-800">${student.name.firstName} ${student.name.lastName}</div>
//             <div class="text-xs text-gray-500">${student.studentId}</div>
//           </div>
//         </div>
//         <div class="text-xs text-blue-600 font-medium text-center bg-blue-50 rounded px-2 py-1">
//           Drag to assign to department
//         </div>
//       </div>
//     `

//     dragElement.style.position = 'absolute'
//     dragElement.style.top = '-1000px'
//     dragElement.style.left = '-1000px'
//     document.body.appendChild(dragElement)

//     e.dataTransfer.setDragImage(dragElement, 150, 75)

//     setTimeout(() => {
//       document.body.removeChild(dragElement)
//     }, 0)

//     setDraggedStudentId(student._id)
//     onStudentDragStart(student)
//   }

//   const handleDragEnd = () => {
//     setDraggedStudentId(null)
//   }

//   return (
//     <div className="w-85 border-r bg-white h-full flex flex-col shadow-sm">
//       {students.length}
//       {/* Header */}
//       <div className="p-2 border-b bg-gradient-to-r from-blue-50 to-purple-50">
//         {/* <h3 className="font-semibold text-lg text-gray-800">Students</h3> */}

//         {/* Search */}
//         <div className="relative mb-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search by Name or ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           />
//         </div>

//         {/* Filter */}
//         <Select value={assignmentFilter} onValueChange={(value: typeof assignmentFilter) => setAssignmentFilter(value)}>
//           <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Students</SelectItem>
//             <SelectItem value="assigned">Assigned</SelectItem>
//             <SelectItem value="unassigned">Unassigned</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Student List */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {isLoading ? (
//           Array.from({ length: 6 }).map((_, i) => <StudentProfileTileSkeleton key={i} />)
//         ) : filteredStudents.length > 0 ? (
//           filteredStudents.map((student) => {
//             const isDragging = draggedStudentId === student._id
//             const canDrag = !student.departmentId
//             const isAssigned = !!student.departmentId

//             return (
//               <div
//                 key={student._id}
//                 draggable={canDrag}
//                 onDragStart={canDrag ? (e) => handleDragStart(student, e) : undefined}
//                 onDragEnd={canDrag ? handleDragEnd : undefined}
//                 className={cn(
//                   "transition-all duration-300 relative",
//                   canDrag ? "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg hover:-translate-y-1" : "cursor-default",
//                   isDragging && "opacity-50 scale-95 rotate-2 z-50",
//                 )}
//               >
//                 <StudentProfileTile
//                   student={student}
//                   departments={departments}
//                   className={cn(
//                     "transition-all duration-300",
//                     isDragging && "shadow-2xl border-blue-500 bg-blue-100",
//                     !canDrag
//                   )}
//                   showDepartment
//                 />
//               </div>
//             )
//           })
//         ) : (
//           <div className="text-center py-8">
//             <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
//             <p className="text-muted-foreground">No students found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }