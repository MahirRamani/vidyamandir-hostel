// "use client"

// import { Search, Filter } from "lucide-react"
// import type React from "react"
// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
// // import { useRoomStore } from "@/store/room-store"
// import type { IStudent } from "@/types/student"
// import { cn } from "@/lib/utils"

// interface StudentPanelProps {
//   onStudentDragStart: (student: IStudent) => void
// }

// export function StudentPanel({ onStudentDragStart }: StudentPanelProps) {
//   // const { students, searchQuery, isLoading, setSearchQuery } = useRoomStore()
//   const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all")
//   const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null)

//   // const filteredStudents = students.filter((student) => {
//   //   const matchesSearch =
//   //     !searchQuery ||
//   //     student.name.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     student.name.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     student.studentId.toLowerCase().includes(searchQuery.toLowerCase())

//   //   const matchesFilter =
//   //     assignmentFilter === "all" ||
//   //     (assignmentFilter === "assigned" && student.roomId) ||
//   //     (assignmentFilter === "unassigned" && !student.roomId)

//   //   return matchesSearch && matchesFilter
//   // })

//   const handleDragStart = (student: IStudent, e: React.DragEvent) => {
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
//         <Select value={assignmentFilter} onValueChange={(value: ) => setAssignmentFilter(value)}>
//           <SelectTrigger>
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Students</SelectItem>
//             <SelectItem value="assigned">Room Assigned</SelectItem>
//             <SelectItem value="unassigned">No Room</SelectItem>
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

//             return (
//               <div
//                 key={student._id}
//                 draggable
//                 onDragStart={(e) => handleDragStart(student, e)}
//                 onDragEnd={handleDragEnd}
//                 className={cn(
//                   "cursor-move transition-all duration-200",
//                   isDragging && "opacity-50 scale-95 shadow-2xl rotate-2",
//                 )}
//               >
//                 <StudentProfileTile
//                   student={student}
//                   className={cn(
//                     "transition-all duration-200",
//                     student.roomId ? "border-green-200 bg-green-50" : "border-gray-200",
//                     isDragging && "shadow-2xl border-blue-300 bg-blue-50",
//                   )}
//                   showRoom
//                 />
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
