"use client"

import { Search, Filter } from "lucide-react"
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
    // Only allow dragging unassigned students or students being reassigned
    if (student.departmentId && assignmentFilter !== "assigned") {
      e.preventDefault()
      return
    }

    e.dataTransfer.setData("application/json", JSON.stringify(student))
    e.dataTransfer.effectAllowed = "move"
    
    // Create a custom drag image with better opacity
    const dragElement = e.currentTarget.cloneNode(true) as HTMLElement
    dragElement.style.transform = 'rotate(3deg)'
    dragElement.style.opacity = '0.8'
    dragElement.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
    dragElement.style.border = '2px solid #3b82f6'
    dragElement.style.backgroundColor = '#eff6ff'
    dragElement.style.position = 'absolute'
    dragElement.style.top = '-1000px'
    document.body.appendChild(dragElement)
    
    e.dataTransfer.setDragImage(dragElement, 
      dragElement.offsetWidth / 2, 
      dragElement.offsetHeight / 2
    )
    
    // Clean up the temporary element
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
    <div className="w-80 border-r bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-4">Students</h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <Select value={assignmentFilter} onValueChange={(value: any) => setAssignmentFilter(value)}>
          <SelectTrigger>
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
            const canDrag = !student.departmentId || assignmentFilter === "assigned"

            return (
              <div
                key={student._id}
                draggable={canDrag}
                onDragStart={(e) => handleDragStart(student, e)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "transition-all duration-200",
                  canDrag ? "cursor-grab active:cursor-grabbing hover:scale-105" : "cursor-not-allowed opacity-60",
                  isDragging && "opacity-30 scale-95",
                )}
              >
                <StudentProfileTile
                  student={student}
                  className={cn(
                    "transition-all duration-200",
                    student.departmentId ? "border-green-200 bg-green-50" : "border-gray-200",
                    isDragging && "shadow-xl border-blue-400 bg-blue-100",
                    !canDrag && "opacity-60",
                    canDrag && "hover:shadow-md hover:border-blue-200"
                  )}
                  showDepartment
                />
                {student.departmentId && assignmentFilter !== "assigned" && (
                  <div className="text-xs text-center text-muted-foreground mt-1">
                    Already assigned - Switch to "Assigned" filter to reassign
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>
    </div>
  )
}




// "use client"

// import { Search, Filter } from "lucide-react"
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
//   const { students, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
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
//     // Only allow dragging unassigned students or students being reassigned
//     if (student.departmentId && assignmentFilter !== "assigned") {
//       e.preventDefault()
//       return
//     }

//     e.dataTransfer.setData("application/json", JSON.stringify(student))
//     e.dataTransfer.effectAllowed = "move"
//     setDraggedStudentId(student._id)
//     onStudentDragStart(student)
//   }

//   const handleDragEnd = () => {
//     setDraggedStudentId(null)
//   }

//   return (
//     <div className="w-80 border-r bg-white h-full flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b">
//         <h3 className="font-semibold text-lg mb-4">Students</h3>

//         {/* Search */}
//         <div className="relative mb-3">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search by name or ID..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Filter */}
//         <Select value={assignmentFilter} onValueChange={(value: any) => setAssignmentFilter(value)}>
//           <SelectTrigger>
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
//             const canDrag = !student.departmentId || assignmentFilter === "assigned"

//             return (
//               <div
//                 key={student._id}
//                 draggable={canDrag}
//                 onDragStart={(e) => handleDragStart(student, e)}
//                 onDragEnd={handleDragEnd}
//                 className={cn(
//                   "transition-all duration-200",
//                   canDrag ? "cursor-move" : "cursor-not-allowed opacity-60",
//                   isDragging && "opacity-50 scale-95 shadow-2xl rotate-2",
//                 )}
//               >
//                 <StudentProfileTile
//                   student={student}
//                   className={cn(
//                     "transition-all duration-200",
//                     student.departmentId ? "border-green-200 bg-green-50" : "border-gray-200",
//                     isDragging && "shadow-2xl border-blue-300 bg-blue-50",
//                     !canDrag && "opacity-60",
//                   )}
//                   showDepartment
//                 />
//                 {student.departmentId && assignmentFilter !== "assigned" && (
//                   <div className="text-xs text-center text-muted-foreground mt-1">
//                     Already assigned - Switch to "Assigned" filter to reassign
//                   </div>
//                 )}
//               </div>
//             )
//           })
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-muted-foreground">No students found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


// // "use client"

// // import { Search, Filter } from "lucide-react"
// // import type React from "react"
// // import { useState } from "react"
// // import { Input } from "@/components/ui/input"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
// // import { useDepartmentStore } from "@/store/department-store"
// // import type { IStudent } from "@/types/student"
// // import { cn } from "@/lib/utils"

// // interface StudentPanelProps {
// //   onStudentDragStart: (student: IStudent) => void
// // }

// // export function StudentPanel({ onStudentDragStart }: StudentPanelProps) {
// //   const { students, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
// //     useDepartmentStore()

// //   const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null)

// //   const filteredStudents = students.filter((student) => {
// //     const matchesSearch =
// //       !searchQuery ||
// //       student.name.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       student.name.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       student.studentId.toLowerCase().includes(searchQuery.toLowerCase())

// //     const matchesFilter =
// //       assignmentFilter === "all" ||
// //       (assignmentFilter === "assigned" && student.departmentId) ||
// //       (assignmentFilter === "unassigned" && !student.departmentId)

// //     return matchesSearch && matchesFilter
// //   })

// //   const handleDragStart = (student: IStudent, e: React.DragEvent) => {
// //     // Only allow dragging unassigned students or students being reassigned
// //     if (student.departmentId && assignmentFilter !== "assigned") {
// //       e.preventDefault()
// //       return
// //     }

// //     e.dataTransfer.setData("application/json", JSON.stringify(student))
// //     e.dataTransfer.effectAllowed = "move"
// //     setDraggedStudentId(student._id)
// //     onStudentDragStart(student)
// //   }

// //   const handleDragEnd = () => {
// //     setDraggedStudentId(null)
// //   }

// //   return (
// //     <div className="w-80 border-r bg-white h-full flex flex-col">
// //       {/* Header */}
// //       <div className="p-4 border-b">
// //         <h3 className="font-semibold text-lg mb-4">Students</h3>

// //         {/* Search */}
// //         <div className="relative mb-3">
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
// //           <Input
// //             placeholder="Search by name or ID..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="pl-10"
// //           />
// //         </div>

// //         {/* Filter */}
// //         <Select value={assignmentFilter} onValueChange={(value: any) => setAssignmentFilter(value)}>
// //           <SelectTrigger>
// //             <Filter className="h-4 w-4 mr-2" />
// //             <SelectValue />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">All Students</SelectItem>
// //             <SelectItem value="assigned">Assigned</SelectItem>
// //             <SelectItem value="unassigned">Unassigned</SelectItem>
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       {/* Student List */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-3">
// //         {isLoading ? (
// //           Array.from({ length: 6 }).map((_, i) => <StudentProfileTileSkeleton key={i} />)
// //         ) : filteredStudents.length > 0 ? (
// //           filteredStudents.map((student) => {
// //             const isDragging = draggedStudentId === student._id
// //             const canDrag = !student.departmentId || assignmentFilter === "assigned"

// //             return (
// //               <div
// //                 key={student._id}
// //                 draggable={canDrag}
// //                 onDragStart={(e) => handleDragStart(student, e)}
// //                 onDragEnd={handleDragEnd}
// //                 className={cn(
// //                   "transition-all duration-200",
// //                   canDrag ? "cursor-move" : "cursor-not-allowed opacity-60",
// //                   isDragging && "opacity-50 scale-95 shadow-2xl rotate-2",
// //                 )}
// //               >
// //                 <StudentProfileTile
// //                   student={student}
// //                   className={cn(
// //                     "transition-all duration-200",
// //                     student.departmentId ? "border-green-200 bg-green-50" : "border-gray-200",
// //                     isDragging && "shadow-2xl border-blue-300 bg-blue-50",
// //                     !canDrag && "opacity-60",
// //                   )}
// //                   showDepartment
// //                 />
// //                 {student.departmentId && assignmentFilter !== "assigned" && (
// //                   <div className="text-xs text-center text-muted-foreground mt-1">
// //                     Already assigned - Switch to "Assigned" filter to reassign
// //                   </div>
// //                 )}
// //               </div>
// //             )
// //           })
// //         ) : (
// //           <div className="text-center py-8">
// //             <p className="text-muted-foreground">No students found</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }


// // // "use client"
// // // import { Search, Filter } from "lucide-react"
// // // import type React from "react"

// // // import { Input } from "@/components/ui/input"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // // import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
// // // import { useDepartmentStore } from "@/store/department-store"
// // // import type { IStudent } from "@/types/student"

// // // interface StudentPanelProps {
// // //   onStudentDragStart: (student: IStudent) => void
// // // }

// // // export function StudentPanel({ onStudentDragStart }: StudentPanelProps) {
// // //   const { students, searchQuery, assignmentFilter, isLoading, setSearchQuery, setAssignmentFilter } =
// // //     useDepartmentStore()

// // //   const filteredStudents = students.filter((student) => {
// // //     const matchesSearch =
// // //       !searchQuery ||
// // //       student.name.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //       student.name.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //       student.studentId.toLowerCase().includes(searchQuery.toLowerCase())

// // //     const matchesFilter =
// // //       assignmentFilter === "all" ||
// // //       (assignmentFilter === "assigned" && student.departmentId) ||
// // //       (assignmentFilter === "unassigned" && !student.departmentId)

// // //     return matchesSearch && matchesFilter
// // //   })

// // //   const handleDragStart = (student: IStudent, e: React.DragEvent) => {
// // //     e.dataTransfer.setData("application/json", JSON.stringify(student))
// // //     onStudentDragStart(student)
// // //   }

// // //   return (
// // //     <div className="w-80 border-r bg-white h-full flex flex-col">
// // //       {/* Header */}
// // //       <div className="p-4 border-b">
// // //         <h3 className="font-semibold text-lg mb-4">Students</h3>

// // //         {/* Search */}
// // //         <div className="relative mb-3">
// // //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
// // //           <Input
// // //             placeholder="Search by name or ID..."
// // //             value={searchQuery}
// // //             onChange={(e) => setSearchQuery(e.target.value)}
// // //             className="pl-10"
// // //           />
// // //         </div>

// // //         {/* Filter */}
// // //         <Select value={assignmentFilter} onValueChange={(value: any) => setAssignmentFilter(value)}>
// // //           <SelectTrigger>
// // //             <Filter className="h-4 w-4 mr-2" />
// // //             <SelectValue />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectItem value="all">All Students</SelectItem>
// // //             <SelectItem value="assigned">Assigned</SelectItem>
// // //             <SelectItem value="unassigned">Unassigned</SelectItem>
// // //           </SelectContent>
// // //         </Select>
// // //       </div>

// // //       {/* Student List */}
// // //       <div className="flex-1 overflow-y-auto p-4 space-y-3">
// // //         {isLoading ? (
// // //           Array.from({ length: 6 }).map((_, i) => <StudentProfileTileSkeleton key={i} />)
// // //         ) : filteredStudents.length > 0 ? (
// // //           filteredStudents.map((student) => (
// // //             <div key={student._id} draggable onDragStart={(e) => handleDragStart(student, e)} className="cursor-move">
// // //               <StudentProfileTile
// // //                 student={student}
// // //                 className={`transition-all duration-200 hover:shadow-lg ${
// // //                   student.departmentId ? "opacity-75 border-green-200 bg-green-50" : ""
// // //                 }`}
// // //                 showDepartment
// // //               />
// // //             </div>
// // //           ))
// // //         ) : (
// // //           <div className="text-center py-8">
// // //             <p className="text-muted-foreground">No students found</p>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }
