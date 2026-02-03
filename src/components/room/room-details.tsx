"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Users, Bed, Building } from "lucide-react"
import type { RoomWithStudents } from "@/types/room"

interface RoomDetailsProps {
  room: RoomWithStudents | null
  onStudentRemove: (studentId: string, roomId: string) => void
}

export function RoomDetails({ room, onStudentRemove }: RoomDetailsProps) {
  if (!room) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a room to view details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleRemoveStudent = (studentId: string) => {
    onStudentRemove(studentId, room._id)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Room {room.number}
          </CardTitle>
          <Badge variant={room.occupiedBeds >= room.capacity ? "destructive" : "secondary"}>
            {room.occupiedBeds}/{room.capacity} Occupied
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p className="text-lg font-bold">{room.capacity}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Occupied</p>
              <p className="text-lg font-bold">{room.occupiedBeds}</p>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div>
          <h4 className="font-semibold mb-3">Assigned Students ({room.students.length})</h4>
          {room.students.length > 0 ? (
            <div className="space-y-2">
              {room.students.map((student) => {
                const fullName = `${student.name.firstName} ${student.name.middleName} ${student.name.lastName}`
                const initials = `${student.name.firstName[0]}${student.name.lastName[0]}`

                return (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={"placeholder.svg"} alt={fullName} />
                        <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{fullName}</p>
                        <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                        {student.bedNo && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Bed {student.bedNo}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveStudent(student._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No students assigned to this room</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
