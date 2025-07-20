"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"

interface StudentProfileTileProps {
  student: IStudent
  onClick?: () => void
  className?: string
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Tested: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  NOC: "bg-red-100 text-red-800 border-red-200",
  "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
}

export function StudentProfileTile({ student, onClick, className }: StudentProfileTileProps) {
  const fullName = `${student.name.firstName} ${student.name.middleName} ${student.name.lastName}`
  const initials = `${student.name.firstName}${student.name.lastName}`

  return (
    <Card
      className={cn("cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]", className)}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={fullName} />
              <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm leading-none">{fullName}</h3>
              <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", statusColors[student.status])}>
            {student.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Standard:</span> {student.standard}
          </div>
          <div>
            <span className="font-medium">Roll No:</span> {student.schoolRollNo}
          </div>
          <div>
            <span className="font-medium">Medium:</span> {student.medium}
          </div>
          <div>
            <span className="font-medium">Year:</span> {student.admissionYear}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
