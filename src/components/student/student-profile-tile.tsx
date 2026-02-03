"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { IStudent } from "@/types/student"
import type { IDepartment } from "@/types/department"
import { cn } from "@/lib/utils"
import { Home, Building, Building2, GraduationCap, IdCard, Languages, X, IdCardLanyard } from "lucide-react"

interface StudentProfileTileProps {
  student: IStudent
  onClick?: () => void
  className?: string
  showDepartment?: boolean
  showRoom?: boolean
  showRemoveButton?: boolean
  onRemove?: (student: IStudent) => void
  // Add this prop to pass departments array for lookup
  departments?: IDepartment[]
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Tested: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  NOC: "bg-red-100 text-red-800 border-red-200",
  "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
}

export function StudentProfileTile({
  student,
  onClick,
  className,
  showDepartment = false,
  showRoom = false,
  showRemoveButton = false,
  onRemove,
  departments = [],
}: StudentProfileTileProps) {
  const fullName = `${student.name.firstName} ${student.name.middleName || ''} ${student.name.lastName}`.replace(/\s+/g, ' ').trim()
  const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`
  
  // Updated to handle multiple departments
  const hasAssignedDepartments = (student.departmentIds && student.departmentIds.length > 0) || !!student.departmentId
  
  // Get department names for display
  const getDepartmentNames = () => {
    let departmentIds: string[] = []
    
    // Handle both old (departmentId) and new (departmentIds) formats
    if (student.departmentIds && student.departmentIds.length > 0) {
      departmentIds = student.departmentIds
    } else if (student.departmentId) {
      departmentIds = [student.departmentId]
    }
    
    if (departmentIds.length === 0) return "No Departments"
    
    const departmentNames = departmentIds
      .map(id => departments.find(dept => dept._id === id)?.name || `Dept ID: ${id}`)
      .filter(Boolean)
    
    if (departmentNames.length === 0) return "Departments Not Found"
    
    return departmentNames.join(", ")
  }

  const departmentDisplay = getDepartmentNames()
  const departmentCount = student.departmentIds ? student.departmentIds.length : (student.departmentId ? 1 : 0)

  // Enhanced Tooltip component for department with better positioning
  const DepartmentTooltip = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30 pointer-events-none shadow-lg max-w-xs">
        <div className="font-medium mb-1">
          {departmentCount > 1 ? `${departmentCount} Departments:` : 'Department:'}
        </div>
        <div className="text-gray-200">
          {title}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )

  return (
    <Card
      className={cn(
        "p-2 cursor-pointer transition-all duration-300 hover:shadow-md select-none relative overflow-hidden group",
        hasAssignedDepartments && "ring-1 ring-green-200 bg-green-100",
        className
      )}
      onClick={onClick}
    >
      {/* Remove Button - appears on hover when showRemoveButton is true */}
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(student)
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 z-10"
          title={`Remove ${student.name.firstName} from department`}
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <CardHeader className="p-2 py-0 h-25">
        <div className="flex items-center space-x-3">
          <Avatar className="h-24 w-24 ring-2 ring-white shadow-sm">
            <AvatarImage src={`https://res.cloudinary.com/dap7sy5lk/image/upload/svm-hostel-students/${student.enquiryId}.jpg` || "/placeholder.svg"} alt={fullName} className="brightness-125"/>
            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm leading-tight text-gray-800 pb-3 break-words">{fullName}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span title="Student ID" className="flex items-center">
                  <IdCardLanyard className="h-6 w-6" />
                </span>
                <p className="font-semibold text-gray-800">{student.studentId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span title="Standard" className="flex items-center">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <p className="font-semibold text-gray-800">{student.standard}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-5 text-xs">
            <div className="flex items-center gap-2">
              <DepartmentTooltip title={departmentDisplay}>
                <span title="Departments" className="flex items-center cursor-help hover:text-blue-600 transition-colors">
                  <Building2 className="h-5 w-5" />
                  {departmentCount > 1 && (
                    <span className="ml-1 bg-blue-100 text-blue-800 text-xs rounded-full px-1.5 py-0.5 font-medium">
                      {departmentCount}
                    </span>
                  )}
                </span>
              </DepartmentTooltip>
              <p className="font-semibold text-gray-800">
                {hasAssignedDepartments ? "✅" : "--"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span title="Medium" className="flex items-center">
                <Languages className="h-5 w-5" />
              </span>
              <p className="font-semibold text-gray-800">{student.medium ? student.medium : "--"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 text-xs">
            <div className="flex items-center gap-2">
              <span title="Room" className="flex items-center">
                <Home className="h-5 w-5" />
              </span>
              <p className="font-semibold text-gray-800">{student.roomId ? student.roomId : "--"}</p>
            </div>

            <div className="flex items-center gap-2">
              <span title="Building" className="flex items-center">
                <Building className="h-5 w-5" />
              </span>
              <p className="font-semibold text-gray-800">{student ? "xyz" : "--"}</p>
            </div>
          </div>

          {showRoom && (
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Room:</span>
              {student.roomId ? (
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Assigned
                  </Badge>
                  {student.bedNo && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Bed {student.bedNo}
                    </Badge>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="ml-1 text-xs bg-gray-50 text-gray-600 border-gray-200">
                  No Room
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton component for loading state (unchanged)
export function StudentProfileTileSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}






// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import type { IStudent } from "@/types/student"
// import type { IDepartment } from "@/types/department"
// import { cn } from "@/lib/utils"
// import { Home, Building, Building2, GraduationCap, IdCard, Languages, X, IdCardLanyard } from "lucide-react"

// interface StudentProfileTileProps {
//   student: IStudent
//   onClick?: () => void
//   className?: string
//   showDepartment?: boolean
//   showRoom?: boolean
//   showRemoveButton?: boolean
//   onRemove?: (student: IStudent) => void
//   // Add this prop to pass departments array for lookup
//   departments?: IDepartment[]
// }

// const statusColors = {
//   Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   Tested: "bg-blue-100 text-blue-800 border-blue-200",
//   Active: "bg-green-100 text-green-800 border-green-200",
//   NOC: "bg-red-100 text-red-800 border-red-200",
//   "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
// }

// export function StudentProfileTile({
//   student,
//   onClick,
//   className,
//   showDepartment = false,
//   showRoom = false,
//   showRemoveButton = false,
//   onRemove,
//   departments = [],
// }: StudentProfileTileProps) {
//   const fullName = `${student.name.firstName} ${student.name.middleName || ''} ${student.name.lastName}`.replace(/\s+/g, ' ').trim()
//   const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`
//   const isAssigned = !!student.departmentId

//   // Find department name by ID
//   const departmentName = student.departmentId 
//     ? departments.find(dept => dept._id === student.departmentId)?.name || `Department ID: ${student.departmentId}`
//     : "No Department"

//   // Tooltip component for department
//   const DepartmentTooltip = ({ children, title }: { children: React.ReactNode, title: string }) => (
//     <div className="relative group">
//       {children}
//       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
//         {title}
//         <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
//       </div>
//     </div>
//   )

//   return (
//     <Card
//       className={cn(
//         "p-2 cursor-pointer transition-all duration-300 hover:shadow-md select-none relative overflow-hidden group",
//         isAssigned && "ring-1 ring-green-200 bg-green-100",
//         className
//       )}
//       onClick={onClick}
//     >
//       {/* Assignment Status Stripe */}
//       {/* {isAssigned && (
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
//       )} */}

//       {/* Remove Button - appears on hover when showRemoveButton is true */}
//       {showRemoveButton && onRemove && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation()
//             onRemove(student)
//           }}
//           className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 z-10"
//           title={`Remove ${student.name.firstName} from department`}
//         >
//           <X className="h-3 w-3" />
//         </button>
//       )}

//       <CardHeader className="p-2 py-0 h-25">
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-24 w-24 ring-2 ring-white shadow-sm">
//             <AvatarImage src={`https://res.cloudinary.com/dap7sy5lk/image/upload/svm-hostel-students/${student.enquiryId}.jpg` || "/placeholder.svg"} alt={fullName} />
//             <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
//               {initials}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1">
//             <h3 className="font-semibold text-sm leading-tight text-gray-800 pb-3 break-words">{fullName}</h3> {/* Added break-words */}
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div className="flex items-center gap-2">
//                 <span title="Student ID" className="flex items-center">
//                   <IdCardLanyard className="h-6 w-6" />
//                 </span>
//                 <p className="font-semibold text-gray-800">{student.studentId}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span title="Standard" className="flex items-center">
//                   <GraduationCap className="h-5 w-5" />
//                 </span>
//                 <p className="font-semibold text-gray-800">{student.standard}</p>
//               </div>
//             </div>
//           </div>

//           {/* Assignment Status Icon */}
//           {/* {isAssigned && (
//             <div className="flex-shrink-0">
//               <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               </div>
//             </div>
//           )} */}
//         </div>
//       </CardHeader>
//       <CardContent className="">
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-5 text-xs">
//             <div className="flex items-center gap-2">
//               <DepartmentTooltip title={departmentName}>
//                 <span title="Department" className="flex items-center cursor-help">
//                   <Building2 className="h-5 w-5" />
//                 </span>
//               </DepartmentTooltip>
//               <p className="font-semibold text-gray-800">{student.departmentId ? "✅" : "--"}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span title="Medium" className="flex items-center">
//                 <Languages className="h-5 w-5" />
//               </span>
//               <p className="font-semibold text-gray-800">{student.medium ? student.medium : "--"}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-5 text-xs">
//             <div className="flex items-center gap-2">
//               <span title="Room" className="flex items-center">
//                 <Home className="h-5 w-5" />
//               </span>
//               <p className="font-semibold text-gray-800">{student.roomId ? student.roomId : "--"}</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <span title="Building" className="flex items-center">
//                 <Building className="h-5 w-5" />
//               </span>
//               <p className="font-semibold text-gray-800">{student ? "xyz" : "--"}</p>
//             </div>
//           </div>


//           {/* {showDepartment && (
//             <div className="text-xs">
//               <div className="flex items-center gap-2">
//                 <span title="Department" className="flex items-center">
//                   <Building2 className="h-5 w-5" />
//                 </span>
//                 <p className="font-semibold text-gray-800">{student.departmentId ? student.departmentId : "--"}</p>
//               </div>

//               {student.departmentId ? (
//                 <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200 font-medium">
//                   Assigned
//                 </Badge>
//               ) : (
//                 <Badge variant="outline" className="ml-1 text-xs bg-orange-50 text-orange-700 border-orange-200 font-medium">
//                   Available
//                 </Badge>
//               )}
//             </div>
//           )} */}

//           {showRoom && (
//             <div className="text-xs">
//               <span className="font-medium text-muted-foreground">Room:</span>
//               {student.roomId ? (
//                 <div className="flex items-center gap-1 mt-1">
//                   <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
//                     Assigned
//                   </Badge>
//                   {student.bedNo && (
//                     <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
//                       Bed {student.bedNo}
//                     </Badge>
//                   )}
//                 </div>
//               ) : (
//                 <Badge variant="outline" className="ml-1 text-xs bg-gray-50 text-gray-600 border-gray-200">
//                   No Room
//                 </Badge>
//               )}
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Skeleton component for loading state
// export function StudentProfileTileSkeleton() {
//   return (
//     <Card className="animate-pulse">
//       <CardHeader className="pb-3">
//         <div className="flex items-center space-x-3">
//           <Skeleton className="h-12 w-12 rounded-full" />
//           <div className="flex-1 space-y-2">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-3 w-20" />
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-2">
//             <div className="space-y-1">
//               <Skeleton className="h-3 w-16" />
//               <Skeleton className="h-3 w-8" />
//             </div>
//             <div className="space-y-1">
//               <Skeleton className="h-3 w-16" />
//               <Skeleton className="h-3 w-12" />
//             </div>
//           </div>
//           <Skeleton className="h-5 w-20" />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }





// // "use client"

// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// // import { Badge } from "@/components/ui/badge"
// // import { Card, CardContent, CardHeader } from "@/components/ui/card"
// // import { Skeleton } from "@/components/ui/skeleton"
// // import type { IStudent } from "@/types/student"
// // import { cn } from "@/lib/utils"
// // import { Home, Building, Building2, GraduationCap, IdCard, Languages, X, IdCardLanyard } from "lucide-react"

// // interface StudentProfileTileProps {
// //   student: IStudent
// //   onClick?: () => void
// //   className?: string
// //   showDepartment?: boolean
// //   showRoom?: boolean
// //   showRemoveButton?: boolean
// //   onRemove?: (student: IStudent) => void
// // }

// // const statusColors = {
// //   Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
// //   Tested: "bg-blue-100 text-blue-800 border-blue-200",
// //   Active: "bg-green-100 text-green-800 border-green-200",
// //   NOC: "bg-red-100 text-red-800 border-red-200",
// //   "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
// // }

// // export function StudentProfileTile({
// //   student,
// //   onClick,
// //   className,
// //   showDepartment = false,
// //   showRoom = false,
// //   showRemoveButton = false,
// //   onRemove,
// // }: StudentProfileTileProps) {
// //   const fullName = `${student.name.firstName} ${student.name.middleName || ''} ${student.name.lastName}`.replace(/\s+/g, ' ').trim()
// //   const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`
// //   const isAssigned = !!student.departmentId

// //   return (
// //     <Card
// //       className={cn(
// //         "p-2 cursor-pointer transition-all duration-300 hover:shadow-md select-none relative overflow-hidden group",
// //         isAssigned && "ring-1 ring-green-200 bg-green-50",
// //         className
// //       )}
// //       onClick={onClick}
// //     >
// //       {/* Assignment Status Stripe */}
// //       {/* {isAssigned && (
// //         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
// //       )} */}

// //       {/* Remove Button - appears on hover when showRemoveButton is true */}
// //       {showRemoveButton && onRemove && (
// //         <button
// //           onClick={(e) => {
// //             e.stopPropagation()
// //             onRemove(student)
// //           }}
// //           className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 z-10"
// //           title={`Remove ${student.name.firstName} from department`}
// //         >
// //           <X className="h-3 w-3" />
// //         </button>
// //       )}

// //       <CardHeader className="p-2 py-0 h-25">
// //         <div className="flex items-center space-x-3">
// //           <Avatar className="h-24 w-24 ring-2 ring-white shadow-sm">
// //             <AvatarImage src={`https://res.cloudinary.com/dap7sy5lk/image/upload/svm-hostel-students/${student.enquiryId}.jpg` || "/placeholder.svg"} alt={fullName} />
// //             <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
// //               {initials}
// //             </AvatarFallback>
// //           </Avatar>
// //           <div className="flex-1">
// //             <h3 className="font-semibold text-sm leading-tight text-gray-800 pb-3 break-words">{fullName}</h3> {/* Added break-words */}
// //             <div className="grid grid-cols-2 gap-2 text-xs">
// //               <div className="flex items-center gap-2">
// //                 <span title="Student ID" className="flex items-center">
// //                   <IdCardLanyard className="h-6 w-6" />
// //                 </span>
// //                 <p className="font-semibold text-gray-800">{student.studentId}</p>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <span title="Standard" className="flex items-center">
// //                   <GraduationCap className="h-5 w-5" />
// //                 </span>
// //                 <p className="font-semibold text-gray-800">{student.standard}</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Assignment Status Icon */}
// //           {/* {isAssigned && (
// //             <div className="flex-shrink-0">
// //               <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
// //                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
// //               </div>
// //             </div>
// //           )} */}
// //         </div>
// //       </CardHeader>
// //       <CardContent className="">
// //         <div className="space-y-2">
// //           <div className="grid grid-cols-2 gap-5 text-xs">
// //             <div className="flex items-center gap-2">
// //               <span title="Department" className="flex items-center">
// //                 <Building2 className="h-5 w-5" />
// //               </span>
// //               <p className="font-semibold text-gray-800">{student.departmentId ? "✅" : "--"}</p>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <span title="Medium" className="flex items-center">
// //                 <Languages className="h-5 w-5" />
// //               </span>
// //               <p className="font-semibold text-gray-800">{student.medium ? student.medium : "--"}</p>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-2 gap-5 text-xs">
// //             <div className="flex items-center gap-2">
// //               <span title="Room" className="flex items-center">
// //                 <Home className="h-5 w-5" />
// //               </span>
// //               <p className="font-semibold text-gray-800">{student.roomId ? student.roomId : "--"}</p>
// //             </div>

// //             <div className="flex items-center gap-2">
// //               <span title="Building" className="flex items-center">
// //                 <Building className="h-5 w-5" />
// //               </span>
// //               <p className="font-semibold text-gray-800">{student ? "xyz" : "--"}</p>
// //             </div>
// //           </div>


// //           {/* {showDepartment && (
// //             <div className="text-xs">
// //               <div className="flex items-center gap-2">
// //                 <span title="Department" className="flex items-center">
// //                   <Building2 className="h-5 w-5" />
// //                 </span>
// //                 <p className="font-semibold text-gray-800">{student.departmentId ? student.departmentId : "--"}</p>
// //               </div>

// //               {student.departmentId ? (
// //                 <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200 font-medium">
// //                   Assigned
// //                 </Badge>
// //               ) : (
// //                 <Badge variant="outline" className="ml-1 text-xs bg-orange-50 text-orange-700 border-orange-200 font-medium">
// //                   Available
// //                 </Badge>
// //               )}
// //             </div>
// //           )} */}

// //           {showRoom && (
// //             <div className="text-xs">
// //               <span className="font-medium text-muted-foreground">Room:</span>
// //               {student.roomId ? (
// //                 <div className="flex items-center gap-1 mt-1">
// //                   <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
// //                     Assigned
// //                   </Badge>
// //                   {student.bedNo && (
// //                     <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
// //                       Bed {student.bedNo}
// //                     </Badge>
// //                   )}
// //                 </div>
// //               ) : (
// //                 <Badge variant="outline" className="ml-1 text-xs bg-gray-50 text-gray-600 border-gray-200">
// //                   No Room
// //                 </Badge>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// // // Skeleton component for loading state
// // export function StudentProfileTileSkeleton() {
// //   return (
// //     <Card className="animate-pulse">
// //       <CardHeader className="pb-3">
// //         <div className="flex items-center space-x-3">
// //           <Skeleton className="h-12 w-12 rounded-full" />
// //           <div className="flex-1 space-y-2">
// //             <Skeleton className="h-4 w-32" />
// //             <Skeleton className="h-3 w-20" />
// //           </div>
// //         </div>
// //       </CardHeader>
// //       <CardContent className="pt-0">
// //         <div className="space-y-2">
// //           <div className="grid grid-cols-2 gap-2">
// //             <div className="space-y-1">
// //               <Skeleton className="h-3 w-16" />
// //               <Skeleton className="h-3 w-8" />
// //             </div>
// //             <div className="space-y-1">
// //               <Skeleton className="h-3 w-16" />
// //               <Skeleton className="h-3 w-12" />
// //             </div>
// //           </div>
// //           <Skeleton className="h-5 w-20" />
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }