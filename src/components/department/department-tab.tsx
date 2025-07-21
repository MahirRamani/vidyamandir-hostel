"use client"

import type React from "react"
import { useState } from "react"
import { MoreHorizontal, Users, Crown, UserCheck, Edit, Trash2 } from "lucide-react"
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

interface DepartmentTabProps {
  department: IDepartment
  onEdit: (department: IDepartment) => void
  onDelete: (department: IDepartment) => void
  onStudentDrop: (student: IStudent, department: IDepartment) => void
}

export function DepartmentTab({ department, onEdit, onDelete, onStudentDrop }: DepartmentTabProps) {
  const { students } = useDepartmentStore()
  const [isDragOver, setIsDragOver] = useState(false)

  // Filter students assigned to this department
  const departmentStudents = students.filter((student) => student.departmentId === department._id)

  // Find HOD and Sub HOD students by their IDs
  const hodStudent = students.find((student) => student._id === department.HOD)
  const subHodStudent = students.find((student) => student._id === department.subHOD)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const studentData = e.dataTransfer.getData("application/json")
    if (studentData) {
      try {
        const student = JSON.parse(studentData)

        // Check if student is already assigned to this department
        if (student.departmentId === department._id) {
          toast.error("Student is already assigned to this department")
          return
        }

        // Check if student is already assigned to another department
        if (student.departmentId && student.departmentId !== department._id) {
          toast.info(`Reassigning student from previous department to ${department.name}`)
        }

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
        "h-full p-6 transition-all duration-300 min-h-[600px]",
        isDragOver && "bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Department Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{department.name}</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {departmentStudents.length} Students
            </Badge>
          </div>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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

      {/* Drop Zone Message */}
      {isDragOver && (
        <div className="text-center py-12 mb-6 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed">
          <div className="text-blue-600 text-lg font-semibold">Drop student here to assign to {department.name}</div>
          <div className="text-blue-500 text-sm mt-2">{departmentStudents.length} students currently assigned</div>
        </div>
      )}

      {/* HOD and Sub HOD */}
      {(hodStudent || subHodStudent) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Department Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hodStudent && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    Head of Department
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <StudentProfileTile student={hodStudent} className="border-yellow-300" />
                </CardContent>
              </Card>
            )}
            {subHodStudent && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Sub Head of Department
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <StudentProfileTile student={subHodStudent} className="border-blue-300" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Department Students */}
      <div>
        <h3 className="font-semibold mb-4">Department Students ({departmentStudents.length})</h3>
        {departmentStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStudents.map((student) => (
              <StudentProfileTile
                key={student._id}
                student={student}
                className={cn(
                  "transition-all duration-200",
                  student._id === department.HOD && "border-yellow-300 bg-yellow-50",
                  student._id === department.subHOD && "border-blue-300 bg-blue-50",
                )}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No students assigned to this department</p>
            <p className="text-sm text-muted-foreground mt-1">Drag students from the left panel to assign them</p>
          </div>
        )}
      </div>
    </div>
  )
}
// "use client"

// import type React from "react"
// import { useState } from "react"
// import { MoreHorizontal, Users, Crown, UserCheck, Edit, Trash2 } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { StudentProfileTile } from "@/components/student/student-profile-tile"
// import { useDepartmentStore } from "@/store/department-store"
// import type { IDepartment } from "@/types/department"
// import type { IStudent } from "@/types/student"
// import { cn } from "@/lib/utils"
// import { toast } from "sonner"

// interface DepartmentTabProps {
//   department: IDepartment
//   onEdit: (department: IDepartment) => void
//   onDelete: (department: IDepartment) => void
//   onStudentDrop: (student: IStudent, department: IDepartment) => void
// }

// export function DepartmentTab({ department, onEdit, onDelete, onStudentDrop }: DepartmentTabProps) {
//   const { students } = useDepartmentStore()
//   const [isDragOver, setIsDragOver] = useState(false)

//   // Filter students assigned to this department
//   const departmentStudents = students.filter((student) => student.departmentId?.toString() === department._id)

//   // Find HOD and Sub HOD students by their IDs
//   const hodStudent = students.find((student) => student._id === department.HOD)
//   const subHodStudent = students.find((student) => student._id === department.subHOD)

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "move"
//     setIsDragOver(true)
//   }

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragOver(false)

//     const studentData = e.dataTransfer.getData("application/json")
//     if (studentData) {
//       try {
//         const student = JSON.parse(studentData)

//         // Check if student is already assigned to this department
//         if (student.departmentId === department._id) {
//           toast.error("Student is already assigned to this department")
//           return
//         }

//         // Check if student is already assigned to another department
//         if (student.departmentId && student.departmentId !== department._id) {
//           toast.info(`Reassigning student from previous department to ${department.name}`)
//         }

//         onStudentDrop(student, department)
//       } catch (error) {
//         console.error("Error parsing dropped student data:", error)
//         toast.error("Failed to assign student")
//       }
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "h-full p-6 transition-all duration-300 min-h-[600px]",
//         isDragOver && "bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg",
//       )}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//     >
//       {/* Department Header */}
//       <div className=" items-center justify-between">
//         {/* <div>
//           <div className="flex items-center gap-3 mb-2">
//             <h2 className="text-2xl font-bold">{department.name}</h2>
//             <Badge variant="outline" className="flex items-center gap-1">
//               <Users className="h-3 w-3" />
//               {departmentStudents.length} Students
//             </Badge>
//           </div>
//           <p className="text-muted-foreground">{department.description}</p>
//         </div> */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => onEdit(department)}>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit Department
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onDelete(department)} className="text-destructive">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete Department
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       {/* Drop Zone Message */}
//       {isDragOver && (
//         <div className="text-center py-12 mb-6 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed">
//           <div className="text-blue-600 text-lg font-semibold">Drop student here to assign to {department.name}</div>
//           <div className="text-blue-500 text-sm mt-2">{departmentStudents.length} students currently assigned</div>
//         </div>
//       )}

//       {/* HOD and Sub HOD */}
//       {(hodStudent || subHodStudent) && (
//         <div className="mb-6">
//           <h3 className="font-semibold mb-3">Department Leadership</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {hodStudent && (
//               <Card className="border-yellow-200 bg-yellow-50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm flex items-center gap-2">
//                     <Crown className="h-4 w-4 text-yellow-600" />
//                     Head of Department
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <StudentProfileTile student={hodStudent} className="border-yellow-300" />
//                 </CardContent>
//               </Card>
//             )}
//             {subHodStudent && (
//               <Card className="border-blue-200 bg-blue-50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm flex items-center gap-2">
//                     <UserCheck className="h-4 w-4 text-blue-600" />
//                     Sub Head of Department
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                   <StudentProfileTile student={subHodStudent} className="border-blue-300" />
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Department Students */}
//       <div>
//         <h3 className="font-semibold mb-4">Department Students ({departmentStudents.length})</h3>


//         {departmentStudents.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {departmentStudents.map((student) => (
//               <StudentProfileTile
//                 key={student._id}
//                 student={student}
//                 className={cn(
//                   "transition-all duration-200",
//                   student._id === department.HOD && "border-yellow-300 bg-yellow-50",
//                   student._id === department.subHOD && "border-blue-300 bg-blue-50",
//                 )}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
//             <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//             <p className="text-muted-foreground">No students assigned to this department</p>
//             <p className="text-sm text-muted-foreground mt-1">Drag students from the left panel to assign them</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// // "use client"

// // import type React from "react"

// // import { useState } from "react"
// // import { MoreHorizontal, Users, Crown, UserCheck, Edit, Trash2 } from "lucide-react"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// // import { StudentProfileTile } from "@/components/student/student-profile-tile"
// // import { useDepartmentStore } from "@/store/department-store"
// // import type { IDepartment } from "@/types/department"
// // import type { IStudent } from "@/types/student"

// // interface DepartmentTabProps {
// //   department: IDepartment
// //   onEdit: (department: IDepartment) => void
// //   onDelete: (department: IDepartment) => void
// //   onStudentDrop: (student: IStudent, department: IDepartment) => void
// // }

// // export function DepartmentTab({ department, onEdit, onDelete, onStudentDrop }: DepartmentTabProps) {
// //   const { students } = useDepartmentStore()
// //   const [isDragOver, setIsDragOver] = useState(false)

// //   // Filter students assigned to this department
// //   const departmentStudents = students.filter((student) => student.departmentId === department._id)

// //   // Find HOD and Sub HOD students by their IDs
// //   const hodStudent = students.find((student) => student._id === department.HOD)
// //   const subHodStudent = students.find((student) => student._id === department.subHOD)

// //   const handleDragOver = (e: React.DragEvent) => {
// //     e.preventDefault()
// //     setIsDragOver(true)
// //   }

// //   const handleDragLeave = (e: React.DragEvent) => {
// //     e.preventDefault()
// //     setIsDragOver(false)
// //   }

// //   const handleDrop = (e: React.DragEvent) => {
// //     e.preventDefault()
// //     setIsDragOver(false)

// //     const studentData = e.dataTransfer.getData("application/json")
// //     if (studentData) {
// //       const student = JSON.parse(studentData)
// //       onStudentDrop(student, department)
// //     }
// //   }

// //   return (
// //     <div
// //       className={`h-full p-6 transition-all duration-200 ${
// //         isDragOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
// //       }`}
// //       onDragOver={handleDragOver}
// //       onDragLeave={handleDragLeave}
// //       onDrop={handleDrop}
// //     >
// //       {/* Department Header */}
// //       <div className="flex items-center justify-between mb-6">
// //         <div>
// //           <div className="flex items-center gap-3 mb-2">
// //             <h2 className="text-2xl font-bold">{department.name}</h2>
// //             <Badge variant="outline" className="flex items-center gap-1">
// //               <Users className="h-3 w-3" />
// //               {departmentStudents.length} Students
// //             </Badge>
// //           </div>
// //           <p className="text-muted-foreground">{department.description}</p>
// //         </div>
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <Button variant="ghost" size="icon">
// //               <MoreHorizontal className="h-4 w-4" />
// //             </Button>
// //           </DropdownMenuTrigger>
// //           <DropdownMenuContent align="end">
// //             <DropdownMenuItem onClick={() => onEdit(department)}>
// //               <Edit className="h-4 w-4 mr-2" />
// //               Edit Department
// //             </DropdownMenuItem>
// //             <DropdownMenuItem onClick={() => onDelete(department)} className="text-destructive">
// //               <Trash2 className="h-4 w-4 mr-2" />
// //               Delete Department
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>
// //       </div>

// //       {/* HOD and Sub HOD */}
// //       {(hodStudent || subHodStudent) && (
// //         <div className="mb-6">
// //           <h3 className="font-semibold mb-3">Department Leadership</h3>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {hodStudent && (
// //               <Card className="border-yellow-200 bg-yellow-50">
// //                 <CardHeader className="pb-2">
// //                   <CardTitle className="text-sm flex items-center gap-2">
// //                     <Crown className="h-4 w-4 text-yellow-600" />
// //                     Head of Department
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className="pt-0">
// //                   <StudentProfileTile student={hodStudent} className="border-yellow-300" />
// //                 </CardContent>
// //               </Card>
// //             )}
// //             {subHodStudent && (
// //               <Card className="border-blue-200 bg-blue-50">
// //                 <CardHeader className="pb-2">
// //                   <CardTitle className="text-sm flex items-center gap-2">
// //                     <UserCheck className="h-4 w-4 text-blue-600" />
// //                     Sub Head of Department
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent className="pt-0">
// //                   <StudentProfileTile student={subHodStudent} className="border-blue-300" />
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* Drop Zone Message */}
// //       {isDragOver && (
// //         <div className="text-center py-12 mb-6">
// //           <div className="text-blue-600 text-lg font-semibold">Drop student here to assign to {department.name}</div>
// //         </div>
// //       )}

// //       {/* Department Students */}
// //       <div>
// //         <h3 className="font-semibold mb-4">Department Students ({departmentStudents.length})</h3>
// //         {departmentStudents.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {departmentStudents.map((student) => (
// //               <StudentProfileTile
// //                 key={student._id}
// //                 student={student}
// //                 className={`${student._id === department.HOD ? "border-yellow-300 bg-yellow-50" : ""} ${
// //                   student._id === department.subHOD ? "border-blue-300 bg-blue-50" : ""
// //                 }`}
// //               />
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
// //             <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
// //             <p className="text-muted-foreground">No students assigned to this department</p>
// //             <p className="text-sm text-muted-foreground mt-1">Drag students from the left panel to assign them</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }
