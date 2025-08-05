"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// interface StudentProfileTileProps {
//   student: IStudent
//   onClick?: () => void
//   className?: string
//   showDepartment?: boolean
//   showRoom?: boolean
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
// }: StudentProfileTileProps) {
//   const fullName = `${student.name.firstName} ${student.name.middleName} ${student.name.lastName}`
//   const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`

//   return (
//     <Card
//       className={cn("cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]", className)}
//       onClick={onClick}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-12 w-12">
//             <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={fullName} />
//             <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-sm leading-none truncate">{fullName}</h3>
//             <p className="text-xs text-muted-foreground mt-1">ID: {student.studentId}</p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div>
//               <span className="font-medium text-muted-foreground">Standard:</span>
//               <p className="font-medium">{student.standard}</p>
//             </div>
//             <div>
//               <span className="font-medium text-muted-foreground">Medium:</span>
//               <p className="font-medium">{student.medium}</p>
//             </div>
//           </div>

//           {showDepartment && (
//             <div className="text-xs">
//               <span className="font-medium text-muted-foreground">Department:</span>
//               {student.departmentId ? (
//                 <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200">
//                   Assigned
//                 </Badge>
//               ) : (
//                 <Badge variant="outline" className="ml-1 text-xs bg-gray-50 text-gray-600 border-gray-200">
//                   Unassigned
//                 </Badge>
//               )}
//             </div>
//           )}

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
//     <Card>
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
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// interface StudentProfileTileProps {
//   student: IStudent
//   onClick?: () => void
//   className?: string
//   showDepartment?: boolean
//   showRoom?: boolean
// }

interface StudentProfileTileProps {
  student: IStudent
  onClick?: () => void
  className?: string
  showDepartment?: boolean
  showRoom?: boolean
  showRemoveButton?: boolean
  onRemove?: (student: IStudent) => void
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Tested: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  NOC: "bg-red-100 text-red-800 border-red-200",
  "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
}

// export function StudentProfileTile({
//   student,
//   onClick,
//   className,
//   showDepartment = false,
//   showRoom = false,
// }: StudentProfileTileProps) {
//   const fullName = `${student.name.firstName} ${student.name.middleName || ''} ${student.name.lastName}`.replace(/\s+/g, ' ').trim()
//   const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`
//   const isAssigned = !!student.departmentId

//   return (
//     <Card
//       className={cn(
//         "cursor-pointer transition-all duration-300 hover:shadow-md select-none relative overflow-hidden",
//         isAssigned && "ring-1 ring-green-200",
//         className
//       )}
//       onClick={onClick}
//     >
//       {/* Assignment Status Stripe */}
//       {isAssigned && (
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
//       )}
  export function StudentProfileTile({
  student,
  onClick,
  className,
  showDepartment = false,
  showRoom = false,
  showRemoveButton = false,
  onRemove,
}: StudentProfileTileProps) {
  const fullName = `${student.name.firstName} ${student.name.middleName || ''} ${student.name.lastName}`.replace(/\s+/g, ' ').trim()
  const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`
  const isAssigned = !!student.departmentId

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-md select-none relative overflow-hidden group",
        isAssigned && "ring-1 ring-green-200",
        className
      )}
      onClick={onClick}
    >
      {/* Assignment Status Stripe */}
      {isAssigned && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
      )}

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
      
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
            <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={fullName} />
            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate text-gray-800">{fullName}</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">ID: {student.studentId}</p>
          </div>
          
          {/* Assignment Status Icon */}
          {isAssigned && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium text-muted-foreground">Standard:</span>
              <p className="font-semibold text-gray-800">{student.standard}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Medium:</span>
              <p className="font-semibold text-gray-800">{student.medium}</p>
            </div>
          </div>

          {showDepartment && (
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Department:</span>
              {student.departmentId ? (
                <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200 font-medium">
                  Assigned
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-1 text-xs bg-orange-50 text-orange-700 border-orange-200 font-medium">
                  Available
                </Badge>
              )}
            </div>
          )}

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

// Skeleton component for loading state
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
// import { cn } from "@/lib/utils"

// interface StudentProfileTileProps {
//   student: IStudent
//   onClick?: () => void
//   className?: string
//   showDepartment?: boolean
// }

// const statusColors = {
//   Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   Tested: "bg-blue-100 text-blue-800 border-blue-200",
//   Active: "bg-green-100 text-green-800 border-green-200",
//   NOC: "bg-red-100 text-red-800 border-red-200",
//   "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
// }

// export function StudentProfileTile({ student, onClick, className, showDepartment = false }: StudentProfileTileProps) {
//   const fullName = `${student.name?.firstName} ${student.name?.middleName} ${student.name?.lastName}`
//   const initials = `${student.name?.firstName}${student.name?.lastName}`

//   return (
//     <Card
//       className={cn("cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] rounded-sm", className)}
//       onClick={onClick}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-24 w-24">
//             <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={fullName} />
//             <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-sm leading-none truncate pb-0.5">{fullName}</h3>
//             {/* <p className="text-xs text-muted-foreground mt-1">ID: {student.studentId}</p> */}
//             <p className="text-xs text-muted-foreground mt-1">Standard: {student.standard}</p>
//             <p className="text-xs text-muted-foreground mt-1">Medium: {student.medium}</p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div>
//               <span className="font-medium text-muted-foreground">ID: {student.studentId}</span>
//             </div>
//           </div>
//           {showDepartment && (
//             <div className="text-xs">
//               <span className="font-medium text-muted-foreground">Department:</span>
//               {student.departmentId ? (
//                 <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200">
//                   Assigned
//                 </Badge>
//               ) : (
//                 <Badge variant="outline" className="ml-1 text-xs bg-gray-50 text-gray-600 border-gray-200">
//                   Unassigned
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
//     <Card>
//       <CardHeader className="pb-3">
//         <div className="flex items-center space-x-3">
//           <Skeleton className="h-24 w-24 rounded-full" />
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
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
