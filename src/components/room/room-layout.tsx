"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Users, Bed } from "lucide-react"
import type { RoomWithStudents } from "@/types/room"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface RoomLayoutProps {
  room: RoomWithStudents
  onStudentDrop: (student: IStudent, room: RoomWithStudents, bedNo?: number) => void
  onStudentRemove: (studentId: string, roomId: string) => void
  onRoomClick: (room: RoomWithStudents) => void
  isSelected: boolean
}

export function RoomLayout({ room, onStudentDrop, onStudentRemove, onRoomClick, isSelected }: RoomLayoutProps) {
  const [isDragOver, setIsDragOver] = useState(false)

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

        // Check if room is at capacity
        if (room.occupiedBeds >= room.capacity) {
          toast.error("Room is at full capacity")
          return
        }

        // Check if student is already in this room
        if (student.roomId === room._id) {
          toast.error("Student is already assigned to this room")
          return
        }

        // Find next available bed number
        const occupiedBeds = room.students.map((s) => s.bedNo).filter(Boolean)
        let nextBedNo = 1
        while (occupiedBeds.includes(nextBedNo) && nextBedNo <= room.capacity) {
          nextBedNo++
        }

        onStudentDrop(student, room, nextBedNo <= room.capacity ? nextBedNo : undefined)
      } catch (error) {
        console.error("Error parsing dropped student data:", error)
        toast.error("Failed to assign student")
      }
    }
  }

  const handleRemoveStudent = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onStudentRemove(studentId, room._id)
  }

  // Create bed layout grid
  const bedGrid = Array.from({ length: room.capacity }, (_, index) => {
    const bedNo = index + 1
    const student = room.students.find((s) => s.bedNo === bedNo)
    const isOccupied = !!student

    return (
      <div
        key={bedNo}
        className={cn(
          "relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-200",
          isOccupied ? "bg-red-500 border-red-600 text-white" : "bg-gray-200 border-gray-300 text-gray-600",
          isDragOver && !isOccupied && "bg-blue-200 border-blue-400",
        )}
        title={
          isOccupied ? `Bed ${bedNo}: ${student?.name.firstName} ${student?.name.lastName}` : `Bed ${bedNo}: Available`
        }
      >
        {bedNo}
        {isOccupied && student && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-1 -right-1 w-4 h-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleRemoveStudent(student._id, e)}
          >
            <X className="w-2 h-2" />
          </Button>
        )}
      </div>
    )
  })

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md group",
        isSelected && "ring-2 ring-blue-500 shadow-lg",
        isDragOver && "bg-blue-50 border-blue-300 shadow-lg",
      )}
      onClick={() => onRoomClick(room)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Room {room.number}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={room.occupiedBeds >= room.capacity ? "destructive" : "secondary"} className="text-xs">
              {room.occupiedBeds}/{room.capacity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Bed Layout Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">{bedGrid}</div>

        {/* Room Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            <span>Capacity: {room.capacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Occupied: {room.occupiedBeds}</span>
          </div>
        </div>

        {/* Drop Zone Indicator */}
        {isDragOver && (
          <div className="mt-2 text-center text-xs text-blue-600 font-medium">Drop student here to assign</div>
        )}
      </CardContent>
    </Card>
  )
}
