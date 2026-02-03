"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { Search, Home, Users, Plus, X } from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

// Types
interface Student {
  id: string
  name: string
  studentId: string
  std: string
  medium: string
  image: string
  inDate?: string
  outDate?: string
}

interface Room {
  id: string
  roomNo: string
  capacity: number
  building: string
  positions: (Student | null)[]
}

// Sample Data
const initialUnassignedStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    studentId: "#12345",
    std: "10th",
    medium: "English",
    image: "AJ",
    inDate: "25/10/23",
    outDate: "02/11/23",
  },
  {
    id: "2",
    name: "Ben Carter",
    studentId: "#12346",
    std: "11th",
    medium: "English",
    image: "BC",
    inDate: "26/10/23",
    outDate: "03/11/23",
  },
  {
    id: "3",
    name: "Charlie Davis",
    studentId: "#12347",
    std: "9th",
    medium: "Hindi",
    image: "CD",
    inDate: "27/10/23",
    outDate: "04/11/23",
  },
  {
    id: "4",
    name: "David Miller",
    studentId: "#12348",
    std: "10th",
    medium: "English",
    image: "DM",
    inDate: "28/10/23",
    outDate: "05/11/23",
  },
  {
    id: "5",
    name: "Ethan Wilson",
    studentId: "#12349",
    std: "11th",
    medium: "Gujarati",
    image: "EW",
    inDate: "29/10/23",
    outDate: "06/11/23",
  },
]

const initialRooms: Room[] = [
  {
    id: "room-101",
    roomNo: "101",
    capacity: 4,
    building: "Building A",
    positions: [
      {
        id: "6",
        name: "John Doe",
        studentId: "#12350",
        std: "10th",
        medium: "English",
        image: "JD",
        inDate: "26/10/23",
        outDate: "02/11/23",
      },
      {
        id: "7",
        name: "Jane Smith",
        studentId: "#12351",
        std: "11th",
        medium: "Hindi",
        image: "JS",
        inDate: "25/10/23",
        outDate: "30/10/23",
      },
      null,
      {
        id: "9",
        name: "Emily White",
        studentId: "#12353",
        std: "10th",
        medium: "Gujarati",
        image: "EW",
        inDate: "28/10/23",
        outDate: "05/11/23",
      },
    ],
  },
  {
    id: "room-102",
    roomNo: "102",
    capacity: 5,
    building: "Building A",
    positions: [
      {
        id: "10",
        name: "Sarah Brown",
        studentId: "#12354",
        std: "11th",
        medium: "English",
        image: "SB",
        inDate: "25/10/23",
        outDate: "02/11/23",
      },
      null,
      {
        id: "11",
        name: "Mike Davis",
        studentId: "#12355",
        std: "10th",
        medium: "Hindi",
        image: "MD",
        inDate: "27/10/23",
        outDate: "04/11/23",
      },
      null,
      null,
    ],
  },
  {
    id: "room-201",
    roomNo: "201",
    capacity: 4,
    building: "Building B",
    positions: [null, null, null, null],
  },
  {
    id: "room-202",
    roomNo: "202",
    capacity: 6,
    building: "Building B",
    positions: [
      {
        id: "12",
        name: "Lisa Anderson",
        studentId: "#12356",
        std: "9th",
        medium: "English",
        image: "LA",
        inDate: "25/10/23",
        outDate: "02/11/23",
      },
      null,
      null,
      null,
      null,
      null,
    ],
  },
]

// Draggable Student Card
function DraggableStudent({ student }: { student: Student }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `student-${student.id}`,
    data: { student },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {student.image}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{student.name}</h3>
            <p className="text-xs text-gray-500">{student.studentId}</p>
            <div className="flex gap-1 mt-1">
              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                {student.std}
              </Badge>
              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                {student.medium}
              </Badge>
            </div>
            {student.inDate && (
              <div className="text-xs text-gray-400 mt-1">
                In: {student.inDate} | Out: {student.outDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Droppable Empty Slot
function EmptySlot({ roomId, position }: { roomId: string; position: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${roomId}-${position}`,
    data: { roomId, position, type: "slot" },
  })

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-4 h-full min-h-[180px] flex items-center justify-center transition-all ${
        isOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium text-center">Drop Student Here</span>
      </div>
    </div>
  )
}

// Droppable Room Column
function DroppableRoomColumn({
  room,
  onRemoveStudent,
}: { room: Room; onRemoveStudent: (roomId: string, position: number) => void }) {
  const occupancy = room.positions.filter((p) => p !== null).length
  const occupancyPercentage = (occupancy / room.capacity) * 100
  const statusColor =
    occupancyPercentage === 100 ? "bg-red-500" : occupancyPercentage >= 60 ? "bg-yellow-500" : "bg-blue-500"

  return (
    <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden border shadow-sm">
      {/* Column Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Room {room.roomNo}</h2>
            <p className="text-xs text-gray-500">{room.building}</p>
          </div>
          <Badge variant={occupancyPercentage === 100 ? "destructive" : "default"} className="text-xs">
            {occupancy}/{room.capacity} Members
          </Badge>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span className="font-semibold">Occupancy</span>
            <span>{Math.round(occupancyPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${statusColor} transition-all`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Slots */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-4">
          {room.positions.map((student, index) => (
            <div key={`position-${index}`} className="relative">
              {student ? (
                <div className="relative group">
                  <button
                    onClick={() => onRemoveStudent(room.id, index)}
                    className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
                    title="Remove student"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg mb-2">
                        {student.image}
                      </div>
                      <h3 className="font-semibold text-sm mb-0.5">{student.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{student.studentId}</p>
                      {student.inDate && (
                        <div className="text-xs text-gray-400 space-y-0.5">
                          <div>In: {student.inDate}</div>
                          <div>Out: {student.outDate}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <EmptySlot roomId={room.id} position={index} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Unassigned Panel
function UnassignedPanel({
  students,
  searchTerm,
  onSearchChange,
}: { students: Student[]; searchTerm: string; onSearchChange: (term: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "unassigned",
  })

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm flex flex-col max-h-[calc(100vh-200px)] sticky top-24">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Unassigned Students
        </h2>
        <Badge variant="secondary" className="mb-3">
          {students.length} {students.length === 1 ? "Student" : "Students"}
        </Badge>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search students..."
            className="pl-10 h-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors ${isOver ? "bg-blue-50" : ""}`}
      >
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Users className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">All students assigned!</p>
            <p className="text-xs">Great job allocating rooms</p>
          </div>
        ) : (
          students.map((student) => <DraggableStudent key={student.id} student={student} />)
        )}
      </div>
    </div>
  )
}

export default function RoomAllocationDashboard() {
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>(initialUnassignedStudents)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>(initialRooms[0]?.building || "")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const handleDragStart = (event: any) => setActiveId(event.active.id)

  const handleRemoveStudent = (roomId: string, position: number) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return
    const student = room.positions[position]
    if (!student) return

    setRooms(
      rooms.map((r) => {
        if (r.id === roomId) {
          const newPositions = [...r.positions]
          newPositions[position] = null
          return { ...r, positions: newPositions }
        }
        return r
      }),
    )

    setUnassignedStudents([...unassignedStudents, student])
  }

  // ✅ Fixed handleDragEnd
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const studentId = active.data?.student?.id || active.id.replace("student-", "")
    let draggedStudent: Student | undefined =
      unassignedStudents.find((s) => s.id === studentId) ||
      rooms.flatMap((r) => r.positions.filter((p) => p !== null)).find((s) => s?.id === studentId)

    if (!draggedStudent) return

    const targetId = over.id

    if (targetId === "unassigned") {
      // Move back to unassigned
      for (const room of rooms) {
        const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent!.id)
        if (foundIndex !== -1) {
          setRooms(
            rooms.map((r) =>
              r.id === room.id
                ? { ...r, positions: r.positions.map((p, i) => (i === foundIndex ? null : p)) }
                : r,
            ),
          )
          setUnassignedStudents([...unassignedStudents, draggedStudent!])
          return
        }
      }
      return
    }

    if (targetId.startsWith("slot-")) {
      // ✅ Proper parsing fix
      const parts = targetId.split("-")
      const targetPosition = Number(parts.pop())
      const roomId = parts.slice(1).join("-") // everything after 'slot-'

      const targetRoom = rooms.find((r) => r.id === roomId)
      if (!targetRoom || targetRoom.positions[targetPosition] !== null) return

      const isFromUnassigned = unassignedStudents.some((s) => s.id === draggedStudent!.id)

      if (isFromUnassigned) {
        setUnassignedStudents(unassignedStudents.filter((s) => s.id !== draggedStudent!.id))
        setRooms(
          rooms.map((r) =>
            r.id === roomId
              ? { ...r, positions: r.positions.map((p, i) => (i === targetPosition ? draggedStudent! : p)) }
              : r,
          ),
        )
      } else {
        // Move between rooms
        let sourceRoomId: string | null = null
        let sourcePosition: number | null = null

        for (const room of rooms) {
          const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent!.id)
          if (foundIndex !== -1) {
            sourceRoomId = room.id
            sourcePosition = foundIndex
            break
          }
        }

        if (sourceRoomId !== null && sourcePosition !== null) {
          setRooms(
            rooms.map((r) => {
              if (r.id === sourceRoomId) {
                const newPositions = [...r.positions]
                newPositions[sourcePosition] = null
                return { ...r, positions: newPositions }
              }
              if (r.id === roomId) {
                const newPositions = [...r.positions]
                newPositions[targetPosition] = draggedStudent!
                return { ...r, positions: newPositions }
              }
              return r
            }),
          )
        }
      }
    }
  }

  const filteredStudents = unassignedStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRooms = rooms.filter((r) => r.building === selectedBuilding)

  return (

    <MainLayout
                title="Birthdays"
                subtitle="Birthdays"
    
            >
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3">
          <Home className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">Room Allocation Dashboard</h1>
        </div>
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {[...new Set(rooms.map((r) => r.building))].map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-[350px_1fr] gap-6">
          <UnassignedPanel students={filteredStudents} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredRooms.map((room) => (
              <DroppableRoomColumn key={room.id} room={room} onRemoveStudent={handleRemoveStudent} />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="cursor-grabbing scale-105 opacity-90 transition-transform">
              <DraggableStudent student={unassignedStudents.find((s) => s.id === activeId.replace("student-", ""))!} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      </div>
      </MainLayout>
  )
}
// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
// import { useDraggable, useDroppable } from "@dnd-kit/core"
// import { Search, Home, Users, Plus, X } from "lucide-react"

// // Types
// interface Student {
//   id: string
//   name: string
//   studentId: string
//   std: string
//   medium: string
//   image: string
//   inDate?: string
//   outDate?: string
// }

// interface Room {
//   id: string
//   roomNo: string
//   capacity: number
//   building: string
//   positions: (Student | null)[]
// }

// // Sample Data
// const initialUnassignedStudents: Student[] = [
//   {
//     id: "1",
//     name: "Alex Johnson",
//     studentId: "#12345",
//     std: "10th",
//     medium: "English",
//     image: "AJ",
//     inDate: "25/10/23",
//     outDate: "02/11/23",
//   },
//   {
//     id: "2",
//     name: "Ben Carter",
//     studentId: "#12346",
//     std: "11th",
//     medium: "English",
//     image: "BC",
//     inDate: "26/10/23",
//     outDate: "03/11/23",
//   },
//   {
//     id: "3",
//     name: "Charlie Davis",
//     studentId: "#12347",
//     std: "9th",
//     medium: "Hindi",
//     image: "CD",
//     inDate: "27/10/23",
//     outDate: "04/11/23",
//   },
//   {
//     id: "4",
//     name: "David Miller",
//     studentId: "#12348",
//     std: "10th",
//     medium: "English",
//     image: "DM",
//     inDate: "28/10/23",
//     outDate: "05/11/23",
//   },
//   {
//     id: "5",
//     name: "Ethan Wilson",
//     studentId: "#12349",
//     std: "11th",
//     medium: "Gujarati",
//     image: "EW",
//     inDate: "29/10/23",
//     outDate: "06/11/23",
//   },
// ]

// const initialRooms: Room[] = [
//   {
//     id: "room-101",
//     roomNo: "101",
//     capacity: 4,
//     building: "Building A",
//     positions: [
//       {
//         id: "6",
//         name: "John Doe",
//         studentId: "#12350",
//         std: "10th",
//         medium: "English",
//         image: "JD",
//         inDate: "26/10/23",
//         outDate: "02/11/23",
//       },
//       {
//         id: "7",
//         name: "Jane Smith",
//         studentId: "#12351",
//         std: "11th",
//         medium: "Hindi",
//         image: "JS",
//         inDate: "25/10/23",
//         outDate: "30/10/23",
//       },
//       null,
//       {
//         id: "9",
//         name: "Emily White",
//         studentId: "#12353",
//         std: "10th",
//         medium: "Gujarati",
//         image: "EW",
//         inDate: "28/10/23",
//         outDate: "05/11/23",
//       },
//     ],
//   },
//   {
//     id: "room-102",
//     roomNo: "102",
//     capacity: 5,
//     building: "Building A",
//     positions: [
//       {
//         id: "10",
//         name: "Sarah Brown",
//         studentId: "#12354",
//         std: "11th",
//         medium: "English",
//         image: "SB",
//         inDate: "25/10/23",
//         outDate: "02/11/23",
//       },
//       null,
//       {
//         id: "11",
//         name: "Mike Davis",
//         studentId: "#12355",
//         std: "10th",
//         medium: "Hindi",
//         image: "MD",
//         inDate: "27/10/23",
//         outDate: "04/11/23",
//       },
//       null,
//       null,
//     ],
//   },
//   {
//     id: "room-201",
//     roomNo: "201",
//     capacity: 4,
//     building: "Building B",
//     positions: [null, null, null, null],
//   },
//   {
//     id: "room-202",
//     roomNo: "202",
//     capacity: 6,
//     building: "Building B",
//     positions: [
//       {
//         id: "12",
//         name: "Lisa Anderson",
//         studentId: "#12356",
//         std: "9th",
//         medium: "English",
//         image: "LA",
//         inDate: "25/10/23",
//         outDate: "02/11/23",
//       },
//       null,
//       null,
//       null,
//       null,
//       null,
//     ],
//   },
// ]

// // Draggable Student Card
// function DraggableStudent({ student, position }: { student: Student; position?: number }) {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: `student-${student.id}`,
//     data: { student, position },
//   })

//   const style = transform
//     ? {
//         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//         opacity: isDragging ? 0.5 : 1,
//       }
//     : undefined

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className="bg-white border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
//     >
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex items-center gap-3 flex-1">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
//             {student.image}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-sm">{student.name}</h3>
//             <p className="text-xs text-gray-500">{student.studentId}</p>
//             <div className="flex gap-1 mt-1">
//               <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
//                 {student.std}
//               </Badge>
//               <Badge variant="outline" className="text-xs px-1 py-0 h-4">
//                 {student.medium}
//               </Badge>
//             </div>
//             {student.inDate && (
//               <div className="text-xs text-gray-400 mt-1">
//                 In: {student.inDate} | Out: {student.outDate}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Droppable Empty Slot
// function EmptySlot({ roomId, position }: { roomId: string; position: number }) {
//   const { setNodeRef, isOver } = useDroppable({
//     id: `slot-${roomId}-${position}`,
//     data: { roomId, position, type: "slot" },
//   })

//   return (
//     <div
//       ref={setNodeRef}
//       className={`border-2 border-dashed rounded-lg p-4 h-full min-h-[180px] flex items-center justify-center transition-all ${
//         isOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//       }`}
//     >
//       <div className="flex flex-col items-center gap-2 text-gray-400">
//         <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
//           <Plus className="w-6 h-6" />
//         </div>
//         <span className="text-xs font-medium text-center">Drop Student Here</span>
//       </div>
//     </div>
//   )
// }

// // Droppable Room Column
// function DroppableRoomColumn({
//   room,
//   onRemoveStudent,
// }: { room: Room; onRemoveStudent: (roomId: string, position: number) => void }) {
//   const occupancy = room.positions.filter((p) => p !== null).length
//   const occupancyPercentage = (occupancy / room.capacity) * 100
//   const statusColor =
//     occupancyPercentage === 100 ? "bg-red-500" : occupancyPercentage >= 60 ? "bg-yellow-500" : "bg-blue-500"

//   return (
//     <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden border shadow-sm">
//       {/* Column Header */}
//       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
//         <div className="flex items-start justify-between mb-3">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Room {room.roomNo}</h2>
//             <p className="text-xs text-gray-500">{room.building}</p>
//           </div>
//           <Badge variant={occupancyPercentage === 100 ? "destructive" : "default"} className="text-xs">
//             {occupancy}/{room.capacity} Members
//           </Badge>
//         </div>
//         {/* Progress Bar */}
//         <div>
//           <div className="flex justify-between text-xs text-gray-600 mb-1">
//             <span className="font-semibold">Occupancy</span>
//             <span>{Math.round(occupancyPercentage)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className={`h-2 rounded-full ${statusColor} transition-all`}
//               style={{ width: `${occupancyPercentage}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Vertical Grid of Student Positions */}
//       <div className="flex-1 overflow-y-auto p-6">
//         <div className="grid grid-cols-4 gap-4">
//           {room.positions.map((student, index) => (
//             <div key={`position-${index}`} className="relative">
//               {student ? (
//                 <div className="relative group">
//                   <button
//                     onClick={() => onRemoveStudent(room.id, index)}
//                     className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
//                     title="Remove student"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                   <div className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
//                     <div className="flex flex-col items-center text-center">
//                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg mb-2">
//                         {student.image}
//                       </div>
//                       <h3 className="font-semibold text-sm mb-0.5">{student.name}</h3>
//                       <p className="text-xs text-gray-500 mb-2">{student.studentId}</p>
//                       {student.inDate && (
//                         <div className="text-xs text-gray-400 space-y-0.5">
//                           <div>In: {student.inDate}</div>
//                           <div>Out: {student.outDate}</div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <EmptySlot roomId={room.id} position={index} />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Unassigned Students Panel
// function UnassignedPanel({
//   students,
//   searchTerm,
//   onSearchChange,
// }: { students: Student[]; searchTerm: string; onSearchChange: (term: string) => void }) {
//   const { setNodeRef, isOver } = useDroppable({
//     id: "unassigned",
//   })

//   return (
//     <div className="w-full bg-white rounded-lg border shadow-sm flex flex-col max-h-[calc(100vh-200px)] sticky top-24">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
//         <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
//           <Users className="w-5 h-5" />
//           Unassigned Students
//         </h2>
//         <Badge variant="secondary" className="mb-3">
//           {students.length} {students.length === 1 ? 'Student' : 'Students'}
//         </Badge>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             placeholder="Search students..."
//             className="pl-10 h-9"
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Student List */}
//       <div
//         ref={setNodeRef}
//         className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors ${isOver ? "bg-blue-50" : ""}`}
//       >
//         {students.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-8 text-gray-400">
//             <Users className="w-8 h-8 mb-2 opacity-50" />
//             <p className="text-sm font-medium">All students assigned!</p>
//             <p className="text-xs">Great job allocating rooms</p>
//           </div>
//         ) : (
//           students.map((student) => <DraggableStudent key={student.id} student={student} />)
//         )}
//       </div>
//     </div>
//   )
// }

// export default function RoomAllocationDashboard() {
//   const [unassignedStudents, setUnassignedStudents] = useState<Student[]>(initialUnassignedStudents)
//   const [rooms, setRooms] = useState<Room[]>(initialRooms)
//   const [activeId, setActiveId] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedBuilding, setSelectedBuilding] = useState<string>(initialRooms[0]?.building || "")

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8,
//       },
//     }),
//   )

//   const handleDragStart = (event: any) => {
//     setActiveId(event.active.id)
//   }

//   const handleRemoveStudent = (roomId: string, position: number) => {
//     const room = rooms.find((r) => r.id === roomId)
//     if (!room) return

//     const student = room.positions[position]
//     if (!student) return

//     setRooms(
//       rooms.map((r) => {
//         if (r.id === roomId) {
//           const newPositions = [...r.positions]
//           newPositions[position] = null
//           return { ...r, positions: newPositions }
//         }
//         return r
//       }),
//     )

//     setUnassignedStudents([...unassignedStudents, student])
//   }

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event
//     setActiveId(null)

//     if (!over) return

//     const studentId = active.data?.student?.id || active.id.replace("student-", "")
//     let draggedStudent: Student | undefined

//     draggedStudent = unassignedStudents.find((s) => s.id === studentId)

//     if (!draggedStudent) {
//       for (const room of rooms) {
//         const found = room.positions.find((s) => s && s.id === studentId)
//         if (found) {
//           draggedStudent = found
//           break
//         }
//       }
//     }

//     if (!draggedStudent) {
//       return
//     }

//     const targetId = over.id

//     if (targetId === "unassigned") {
//       let sourceRoomId: string | null = null
//       let sourcePosition: number | null = null

//       for (const room of rooms) {
//         const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent.id)
//         if (foundIndex !== -1) {
//           sourceRoomId = room.id
//           sourcePosition = foundIndex
//           break
//         }
//       }

//       if (sourceRoomId !== null && sourcePosition !== null) {
//         setRooms(
//           rooms.map((room) => {
//             if (room.id === sourceRoomId) {
//               const newPositions = [...room.positions]
//               newPositions[sourcePosition!] = null
//               return { ...room, positions: newPositions }
//             }
//             return room
//           }),
//         )
//         setUnassignedStudents([...unassignedStudents, draggedStudent])
//       }
//       return
//     }

//     if (targetId.startsWith("slot-")) {
//       const parts = targetId.split("-")
//       const roomId = parts[1]
//       const targetPosition = Number.parseInt(parts[2])

//       const targetRoom = rooms.find((r) => r.id === roomId)
//       if (!targetRoom) {
//         return
//       }

//       if (targetRoom.positions[targetPosition] !== null) {
//         return
//       }

//       const isFromUnassigned = unassignedStudents.some((s) => s.id === draggedStudent.id)

//       if (isFromUnassigned) {
//         setUnassignedStudents(unassignedStudents.filter((s) => s.id !== draggedStudent.id))
//         setRooms(
//           rooms.map((room) => {
//             if (room.id === roomId) {
//               const newPositions = [...room.positions]
//               newPositions[targetPosition] = draggedStudent
//               return { ...room, positions: newPositions }
//             }
//             return room
//           }),
//         )
//       } else {
//         let sourceRoomId: string | null = null
//         let sourcePosition: number | null = null

//         for (const room of rooms) {
//           const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent.id)
//           if (foundIndex !== -1) {
//             sourceRoomId = room.id
//             sourcePosition = foundIndex
//             break
//           }
//         }

//         if (sourceRoomId !== null && sourcePosition !== null) {
//           setRooms(
//             rooms.map((room) => {
//               if (room.id === sourceRoomId) {
//                 const newPositions = [...room.positions]
//                 newPositions[sourcePosition!] = null
//                 return { ...room, positions: newPositions }
//               }
//               if (room.id === roomId) {
//                 const newPositions = [...room.positions]
//                 newPositions[targetPosition] = draggedStudent
//                 return { ...room, positions: newPositions }
//               }
//               return room
//             }),
//           )
//         }
//       }
//     }
//   }

//   const filteredUnassigned = unassignedStudents.filter(
//     (student) =>
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const buildings = Array.from(new Set(rooms.map((r) => r.building)))
//   const currentBuilding = selectedBuilding || buildings[0]
//   const filteredRooms = rooms.filter((room) => room.building === currentBuilding)

//   const activeStudent = activeId
//     ? unassignedStudents.find((s) => `student-${s.id}` === activeId) ||
//       rooms.flatMap((r) => r.positions.filter((p) => p !== null)).find((s) => `student-${s?.id}` === activeId)
//     : null

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCorners}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       <div className="min-h-screen bg-gray-100">
//         {/* Header */}
//         <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
//           <h1 className="text-2xl font-bold text-gray-900">Room Allocation Dashboard</h1>
//           <p className="text-sm text-gray-600">
//             Drag students to empty positions to assign • Drag to unassigned panel to remove
//           </p>
//         </div>

//         {/* Building Tabs */}
//         {buildings.length > 1 && (
//           <div className="bg-white border-b px-6 py-3 sticky top-16 z-10">
//             <div className="flex gap-2">
//               {buildings.map((building) => (
//                 <button
//                   key={building}
//                   onClick={() => setSelectedBuilding(building)}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
//                     currentBuilding === building
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   <Home className="w-4 h-4 inline mr-2" />
//                   {building}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="flex gap-6 p-6 pb-8">
//           {/* Unassigned Panel */}
//           <div className="w-80 flex-shrink-0">
//             <UnassignedPanel students={filteredUnassigned} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
//           </div>

//           {/* Room Columns */}
//           <div className="flex-1 space-y-6">
//             {filteredRooms.map((room) => (
//               <DroppableRoomColumn key={room.id} room={room} onRemoveStudent={handleRemoveStudent} />
//             ))}
//           </div>
//         </div>
//       </div>

//       <DragOverlay>
//         {activeStudent && (
//           <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-xl rotate-3">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
//                 {activeStudent.image}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-sm">{activeStudent.name}</h3>
//                 <p className="text-xs text-gray-500">{activeStudent.studentId}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </DragOverlay>
//     </DndContext>
//   )
// }// "use client"

// // import { useState } from "react"
// // import { Input } from "@/components/ui/input"
// // import { Badge } from "@/components/ui/badge"
// // import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
// // import { useDraggable, useDroppable } from "@dnd-kit/core"
// // import { Search, Home, Users, Plus, X } from "lucide-react"

// // // Types
// // interface Student {
// //   id: string
// //   name: string
// //   studentId: string
// //   std: string
// //   medium: string
// //   image: string
// //   inDate?: string
// //   outDate?: string
// // }

// // interface Room {
// //   id: string
// //   roomNo: string
// //   capacity: number
// //   building: string
// //   positions: (Student | null)[]
// // }

// // // Sample Data
// // const initialUnassignedStudents: Student[] = [
// //   {
// //     id: "1",
// //     name: "Alex Johnson",
// //     studentId: "#12345",
// //     std: "10th",
// //     medium: "English",
// //     image: "AJ",
// //     inDate: "25/10/23",
// //     outDate: "02/11/23",
// //   },
// //   {
// //     id: "2",
// //     name: "Ben Carter",
// //     studentId: "#12346",
// //     std: "11th",
// //     medium: "English",
// //     image: "BC",
// //     inDate: "26/10/23",
// //     outDate: "03/11/23",
// //   },
// //   {
// //     id: "3",
// //     name: "Charlie Davis",
// //     studentId: "#12347",
// //     std: "9th",
// //     medium: "Hindi",
// //     image: "CD",
// //     inDate: "27/10/23",
// //     outDate: "04/11/23",
// //   },
// //   {
// //     id: "4",
// //     name: "David Miller",
// //     studentId: "#12348",
// //     std: "10th",
// //     medium: "English",
// //     image: "DM",
// //     inDate: "28/10/23",
// //     outDate: "05/11/23",
// //   },
// //   {
// //     id: "5",
// //     name: "Ethan Wilson",
// //     studentId: "#12349",
// //     std: "11th",
// //     medium: "Gujarati",
// //     image: "EW",
// //     inDate: "29/10/23",
// //     outDate: "06/11/23",
// //   },
// // ]

// // const initialRooms: Room[] = [
// //   {
// //     id: "room-101",
// //     roomNo: "101",
// //     capacity: 4,
// //     building: "Building A",
// //     positions: [
// //       {
// //         id: "6",
// //         name: "John Doe",
// //         studentId: "#12350",
// //         std: "10th",
// //         medium: "English",
// //         image: "JD",
// //         inDate: "26/10/23",
// //         outDate: "02/11/23",
// //       },
// //       {
// //         id: "7",
// //         name: "Jane Smith",
// //         studentId: "#12351",
// //         std: "11th",
// //         medium: "Hindi",
// //         image: "JS",
// //         inDate: "25/10/23",
// //         outDate: "30/10/23",
// //       },
// //       null,
// //       {
// //         id: "9",
// //         name: "Emily White",
// //         studentId: "#12353",
// //         std: "10th",
// //         medium: "Gujarati",
// //         image: "EW",
// //         inDate: "28/10/23",
// //         outDate: "05/11/23",
// //       },
// //     ],
// //   },
// //   {
// //     id: "room-102",
// //     roomNo: "102",
// //     capacity: 5,
// //     building: "Building A",
// //     positions: [
// //       {
// //         id: "10",
// //         name: "Sarah Brown",
// //         studentId: "#12354",
// //         std: "11th",
// //         medium: "English",
// //         image: "SB",
// //         inDate: "25/10/23",
// //         outDate: "02/11/23",
// //       },
// //       null,
// //       {
// //         id: "11",
// //         name: "Mike Davis",
// //         studentId: "#12355",
// //         std: "10th",
// //         medium: "Hindi",
// //         image: "MD",
// //         inDate: "27/10/23",
// //         outDate: "04/11/23",
// //       },
// //       null,
// //       null,
// //     ],
// //   },
// //   {
// //     id: "room-201",
// //     roomNo: "201",
// //     capacity: 4,
// //     building: "Building B",
// //     positions: [null, null, null, null],
// //   },
// //   {
// //     id: "room-202",
// //     roomNo: "202",
// //     capacity: 6,
// //     building: "Building B",
// //     positions: [
// //       {
// //         id: "12",
// //         name: "Lisa Anderson",
// //         studentId: "#12356",
// //         std: "9th",
// //         medium: "English",
// //         image: "LA",
// //         inDate: "25/10/23",
// //         outDate: "02/11/23",
// //       },
// //       null,
// //       null,
// //       null,
// //       null,
// //       null,
// //     ],
// //   },
// // ]

// // // Draggable Student Card
// // function DraggableStudent({ student, position }: { student: Student; position?: number }) {
// //   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
// //     id: `student-${student.id}`,
// //     data: { student, position },
// //   })

// //   const style = transform
// //     ? {
// //         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
// //         opacity: isDragging ? 0.5 : 1,
// //       }
// //     : undefined

// //   return (
// //     <div
// //       ref={setNodeRef}
// //       style={style}
// //       {...listeners}
// //       {...attributes}
// //       className="bg-white border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
// //     >
// //       <div className="flex items-start justify-between gap-3">
// //         <div className="flex items-center gap-3 flex-1">
// //           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
// //             {student.image}
// //           </div>
// //           <div className="flex-1 min-w-0">
// //             <h3 className="font-semibold text-sm">{student.name}</h3>
// //             <p className="text-xs text-gray-500">{student.studentId}</p>
// //             <div className="flex gap-1 mt-1">
// //               <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
// //                 {student.std}
// //               </Badge>
// //               <Badge variant="outline" className="text-xs px-1 py-0 h-4">
// //                 {student.medium}
// //               </Badge>
// //             </div>
// //             {student.inDate && (
// //               <div className="text-xs text-gray-400 mt-1">
// //                 In: {student.inDate} | Out: {student.outDate}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // Droppable Empty Slot
// // function EmptySlot({ roomId, position }: { roomId: string; position: number }) {
// //   const { setNodeRef, isOver } = useDroppable({
// //     id: `slot-${roomId}-${position}`,
// //     data: { roomId, position, type: "slot" },
// //   })

// //   return (
// //     <div
// //       ref={setNodeRef}
// //       className={`border-2 border-dashed rounded-lg p-4 h-full min-h-[180px] flex items-center justify-center transition-all ${
// //         isOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
// //       }`}
// //     >
// //       <div className="flex flex-col items-center gap-2 text-gray-400">
// //         <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
// //           <Plus className="w-6 h-6" />
// //         </div>
// //         <span className="text-xs font-medium text-center">Drop Student Here</span>
// //       </div>
// //     </div>
// //   )
// // }

// // // Droppable Room Column
// // function DroppableRoomColumn({
// //   room,
// //   onRemoveStudent,
// // }: { room: Room; onRemoveStudent: (roomId: string, position: number) => void }) {
// //   const occupancy = room.positions.filter((p) => p !== null).length
// //   const occupancyPercentage = (occupancy / room.capacity) * 100
// //   const statusColor =
// //     occupancyPercentage === 100 ? "bg-red-500" : occupancyPercentage >= 60 ? "bg-yellow-500" : "bg-blue-500"

// //   return (
// //     <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden border shadow-sm">
// //       {/* Column Header */}
// //       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
// //         <div className="flex items-start justify-between mb-3">
// //           <div>
// //             <h2 className="text-xl font-bold text-gray-900">Room {room.roomNo}</h2>
// //             <p className="text-xs text-gray-500">{room.building}</p>
// //           </div>
// //           <Badge variant={occupancyPercentage === 100 ? "destructive" : "default"} className="text-xs">
// //             {occupancy}/{room.capacity} Members
// //           </Badge>
// //         </div>
// //         {/* Progress Bar */}
// //         <div>
// //           <div className="flex justify-between text-xs text-gray-600 mb-1">
// //             <span className="font-semibold">Occupancy</span>
// //             <span>{Math.round(occupancyPercentage)}%</span>
// //           </div>
// //           <div className="w-full bg-gray-200 rounded-full h-2">
// //             <div
// //               className={`h-2 rounded-full ${statusColor} transition-all`}
// //               style={{ width: `${occupancyPercentage}%` }}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Vertical Grid of Student Positions */}
// //       <div className="flex-1 overflow-y-auto p-6">
// //         <div className="grid grid-cols-4 gap-4">
// //           {room.positions.map((student, index) => (
// //             <div key={`position-${index}`} className="relative">
// //               {student ? (
// //                 <div className="relative group">
// //                   <button
// //                     onClick={() => onRemoveStudent(room.id, index)}
// //                     className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
// //                     title="Remove student"
// //                   >
// //                     <X className="w-3 h-3" />
// //                   </button>
// //                   <div className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
// //                     <div className="flex flex-col items-center text-center">
// //                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg mb-2">
// //                         {student.image}
// //                       </div>
// //                       <h3 className="font-semibold text-sm mb-0.5">{student.name}</h3>
// //                       <p className="text-xs text-gray-500 mb-2">{student.studentId}</p>
// //                       {student.inDate && (
// //                         <div className="text-xs text-gray-400 space-y-0.5">
// //                           <div>In: {student.inDate}</div>
// //                           <div>Out: {student.outDate}</div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <EmptySlot roomId={room.id} position={index} />
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // Unassigned Students Panel
// // function UnassignedPanel({
// //   students,
// //   searchTerm,
// //   onSearchChange,
// // }: { students: Student[]; searchTerm: string; onSearchChange: (term: string) => void }) {
// //   const { setNodeRef, isOver } = useDroppable({
// //     id: "unassigned",
// //   })

// //   return (
// //     <div className="w-full bg-white rounded-lg border shadow-sm flex flex-col max-h-[calc(100vh-200px)] sticky top-24">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-4">
// //         <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
// //           <Users className="w-5 h-5" />
// //           Unassigned Students
// //         </h2>
// //         <Badge variant="secondary" className="mb-3">
// //           {students.length} {students.length === 1 ? 'Student' : 'Students'}
// //         </Badge>
// //         <div className="relative">
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //           <Input
// //             placeholder="Search students..."
// //             className="pl-10 h-9"
// //             value={searchTerm}
// //             onChange={(e) => onSearchChange(e.target.value)}
// //           />
// //         </div>
// //       </div>

// //       {/* Student List */}
// //       <div
// //         ref={setNodeRef}
// //         className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors ${isOver ? "bg-blue-50" : ""}`}
// //       >
// //         {students.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center py-8 text-gray-400">
// //             <Users className="w-8 h-8 mb-2 opacity-50" />
// //             <p className="text-sm font-medium">All students assigned!</p>
// //             <p className="text-xs">Great job allocating rooms</p>
// //           </div>
// //         ) : (
// //           students.map((student) => <DraggableStudent key={student.id} student={student} />)
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default function RoomAllocationDashboard() {
// //   const [unassignedStudents, setUnassignedStudents] = useState<Student[]>(initialUnassignedStudents)
// //   const [rooms, setRooms] = useState<Room[]>(initialRooms)
// //   const [activeId, setActiveId] = useState<string | null>(null)
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [selectedBuilding, setSelectedBuilding] = useState<string>(initialRooms[0]?.building || "")

// //   const sensors = useSensors(
// //     useSensor(PointerSensor, {
// //       activationConstraint: {
// //         distance: 8,
// //       },
// //     }),
// //   )

// //   const handleDragStart = (event: any) => {
// //     setActiveId(event.active.id)
// //   }

// //   const handleRemoveStudent = (roomId: string, position: number) => {
// //     const room = rooms.find((r) => r.id === roomId)
// //     if (!room) return

// //     const student = room.positions[position]
// //     if (!student) return

// //     setRooms(
// //       rooms.map((r) => {
// //         if (r.id === roomId) {
// //           const newPositions = [...r.positions]
// //           newPositions[position] = null
// //           return { ...r, positions: newPositions }
// //         }
// //         return r
// //       }),
// //     )

// //     setUnassignedStudents([...unassignedStudents, student])
// //   }

// //   const handleDragEnd = (event: any) => {
// //     const { active, over } = event
// //     setActiveId(null)

// //     if (!over) return

// //     const studentId = active.data?.student?.id || active.id.replace("student-", "")
// //     let draggedStudent: Student | undefined

// //     draggedStudent = unassignedStudents.find((s) => s.id === studentId)

// //     if (!draggedStudent) {
// //       for (const room of rooms) {
// //         const found = room.positions.find((s) => s && s.id === studentId)
// //         if (found) {
// //           draggedStudent = found
// //           break
// //         }
// //       }
// //     }

// //     if (!draggedStudent) {
// //       return
// //     }

// //     const targetId = over.id

// //     if (targetId === "unassigned") {
// //       let sourceRoomId: string | null = null
// //       let sourcePosition: number | null = null

// //       for (const room of rooms) {
// //         const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent.id)
// //         if (foundIndex !== -1) {
// //           sourceRoomId = room.id
// //           sourcePosition = foundIndex
// //           break
// //         }
// //       }

// //       if (sourceRoomId !== null && sourcePosition !== null) {
// //         setRooms(
// //           rooms.map((room) => {
// //             if (room.id === sourceRoomId) {
// //               const newPositions = [...room.positions]
// //               newPositions[sourcePosition!] = null
// //               return { ...room, positions: newPositions }
// //             }
// //             return room
// //           }),
// //         )
// //         setUnassignedStudents([...unassignedStudents, draggedStudent])
// //       }
// //       return
// //     }

// //     if (targetId.startsWith("slot-")) {
// //       const parts = targetId.split("-")
// //       const roomId = parts[1]
// //       const targetPosition = Number.parseInt(parts[2])

// //       const targetRoom = rooms.find((r) => r.id === roomId)
// //       if (!targetRoom) {
// //         return
// //       }

// //       if (targetRoom.positions[targetPosition] !== null) {
// //         return
// //       }

// //       const isFromUnassigned = unassignedStudents.some((s) => s.id === draggedStudent.id)

// //       if (isFromUnassigned) {
// //         setUnassignedStudents(unassignedStudents.filter((s) => s.id !== draggedStudent.id))
// //         setRooms(
// //           rooms.map((room) => {
// //             if (room.id === roomId) {
// //               const newPositions = [...room.positions]
// //               newPositions[targetPosition] = draggedStudent
// //               return { ...room, positions: newPositions }
// //             }
// //             return room
// //           }),
// //         )
// //       } else {
// //         let sourceRoomId: string | null = null
// //         let sourcePosition: number | null = null

// //         for (const room of rooms) {
// //           const foundIndex = room.positions.findIndex((s) => s?.id === draggedStudent.id)
// //           if (foundIndex !== -1) {
// //             sourceRoomId = room.id
// //             sourcePosition = foundIndex
// //             break
// //           }
// //         }

// //         if (sourceRoomId !== null && sourcePosition !== null) {
// //           setRooms(
// //             rooms.map((room) => {
// //               if (room.id === sourceRoomId) {
// //                 const newPositions = [...room.positions]
// //                 newPositions[sourcePosition!] = null
// //                 return { ...room, positions: newPositions }
// //               }
// //               if (room.id === roomId) {
// //                 const newPositions = [...room.positions]
// //                 newPositions[targetPosition] = draggedStudent
// //                 return { ...room, positions: newPositions }
// //               }
// //               return room
// //             }),
// //           )
// //         }
// //       }
// //     }
// //   }

// //   const filteredUnassigned = unassignedStudents.filter(
// //     (student) =>
// //       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
// //   )

// //   const buildings = Array.from(new Set(rooms.map((r) => r.building)))
// //   const currentBuilding = selectedBuilding || buildings[0]
// //   const filteredRooms = rooms.filter((room) => room.building === currentBuilding)

// //   const activeStudent = activeId
// //     ? unassignedStudents.find((s) => `student-${s.id}` === activeId) ||
// //       rooms.flatMap((r) => r.positions.filter((p) => p !== null)).find((s) => `student-${s?.id}` === activeId)
// //     : null

// //   return (
// //     <DndContext
// //       sensors={sensors}
// //       collisionDetection={closestCorners}
// //       onDragStart={handleDragStart}
// //       onDragEnd={handleDragEnd}
// //     >
// //       <div className="min-h-screen bg-gray-100">
// //         {/* Header */}
// //         <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
// //           <h1 className="text-2xl font-bold text-gray-900">Room Allocation Dashboard</h1>
// //           <p className="text-sm text-gray-600">
// //             Drag students to empty positions to assign • Drag to unassigned panel to remove
// //           </p>
// //         </div>

// //         {/* Building Tabs */}
// //         {buildings.length > 1 && (
// //           <div className="bg-white border-b px-6 py-3 sticky top-16 z-10">
// //             <div className="flex gap-2">
// //               {buildings.map((building) => (
// //                 <button
// //                   key={building}
// //                   onClick={() => setSelectedBuilding(building)}
// //                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
// //                     currentBuilding === building
// //                       ? "bg-blue-500 text-white"
// //                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// //                   }`}
// //                 >
// //                   <Home className="w-4 h-4 inline mr-2" />
// //                   {building}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Main Content */}
// //         <div className="flex gap-6 p-6 pb-8">
// //           {/* Unassigned Panel */}
// //           <div className="w-80 flex-shrink-0">
// //             <UnassignedPanel students={filteredUnassigned} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
// //           </div>

// //           {/* Room Columns */}
// //           <div className="flex-1 space-y-6">
// //             {filteredRooms.map((room) => (
// //               <DroppableRoomColumn key={room.id} room={room} onRemoveStudent={handleRemoveStudent} />
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <DragOverlay>
// //         {activeStudent && (
// //           <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-xl rotate-3">
// //             <div className="flex items-center gap-3">
// //               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
// //                 {activeStudent.image}
// //               </div>
// //               <div>
// //                 <h3 className="font-semibold text-sm">{activeStudent.name}</h3>
// //                 <p className="text-xs text-gray-500">{activeStudent.studentId}</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </DragOverlay>
// //     </DndContext>
// //   )
// // }// "use client";
// // // import React, { useState } from 'react';
// // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // import { Input } from '@/components/ui/input';
// // // import { Badge } from '@/components/ui/badge';
// // // import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// // // import { useDraggable, useDroppable } from '@dnd-kit/core';
// // // import { Search, User, Home, Users } from 'lucide-react';

// // // // Types
// // // interface Student {
// // //   id: string;
// // //   name: string;
// // //   studentId: string;
// // //   std: string;
// // //   medium: string;
// // //   image: string;
// // //   roomId?: string;
// // // }

// // // interface Room {
// // //   id: string;
// // //   roomNo: string;
// // //   capacity: number;
// // //   building: string;
// // //   students: Student[];
// // // }

// // // // Sample Data
// // // const initialUnassignedStudents: Student[] = [
// // //   { id: '1', name: 'Alex Johnson', studentId: '#12345', std: '10th', medium: 'English', image: 'AJ' },
// // //   { id: '2', name: 'Ben Carter', studentId: '#12346', std: '11th', medium: 'English', image: 'BC' },
// // //   { id: '3', name: 'Charlie Davis', studentId: '#12347', std: '9th', medium: 'Hindi', image: 'CD' },
// // //   { id: '4', name: 'David Miller', studentId: '#12348', std: '10th', medium: 'English', image: 'DM' },
// // //   { id: '5', name: 'Ethan Wilson', studentId: '#12349', std: '11th', medium: 'Gujarati', image: 'EW' },
// // // ];

// // // const initialRooms: Room[] = [
// // //   {
// // //     id: 'room-101',
// // //     roomNo: '101',
// // //     capacity: 4,
// // //     building: 'Building A',
// // //     students: [
// // //       { id: '6', name: 'John Doe', studentId: '#12350', std: '10th', medium: 'English', image: 'JD' },
// // //       { id: '7', name: 'Jane Smith', studentId: '#12351', std: '11th', medium: 'Hindi', image: 'JS' },
// // //       { id: '8', name: 'Peter Jones', studentId: '#12352', std: '9th', medium: 'English', image: 'PJ' },
// // //       { id: '9', name: 'Emily White', studentId: '#12353', std: '10th', medium: 'Gujarati', image: 'EW' },
// // //     ]
// // //   },
// // //   {
// // //     id: 'room-102',
// // //     roomNo: '102',
// // //     capacity: 5,
// // //     building: 'Building A',
// // //     students: [
// // //       { id: '10', name: 'Sarah Brown', studentId: '#12354', std: '11th', medium: 'English', image: 'SB' },
// // //       { id: '11', name: 'Mike Davis', studentId: '#12355', std: '10th', medium: 'Hindi', image: 'MD' },
// // //     ]
// // //   },
// // //   {
// // //     id: 'room-201',
// // //     roomNo: '201',
// // //     capacity: 4,
// // //     building: 'Building B',
// // //     students: []
// // //   },
// // //   {
// // //     id: 'room-202',
// // //     roomNo: '202',
// // //     capacity: 6,
// // //     building: 'Building B',
// // //     students: [
// // //       { id: '12', name: 'Lisa Anderson', studentId: '#12356', std: '9th', medium: 'English', image: 'LA' },
// // //     ]
// // //   },
// // // ];

// // // // Draggable Student Card
// // // function DraggableStudent({ student }: { student: Student }) {
// // //   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
// // //     id: student.id,
// // //     data: { student }
// // //   });

// // //   const style = transform ? {
// // //     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
// // //     opacity: isDragging ? 0.5 : 1,
// // //   } : undefined;

// // //   return (
// // //     <div
// // //       ref={setNodeRef}
// // //       style={style}
// // //       {...listeners}
// // //       {...attributes}
// // //       className="bg-white border rounded-lg p-2 mb-2 cursor-move hover:shadow-md transition-shadow"
// // //     >
// // //       <div className="flex items-center gap-2">
// // //         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
// // //           {student.image}
// // //         </div>
// // //         <div className="flex-1 min-w-0">
// // //           <h3 className="font-semibold text-xs truncate">{student.name}</h3>
// // //           <p className="text-xs text-gray-500">{student.studentId}</p>
// // //           <div className="flex gap-1 mt-0.5">
// // //             <Badge variant="secondary" className="text-xs px-1 py-0 h-4">{student.std}</Badge>
// // //             <Badge variant="outline" className="text-xs px-1 py-0 h-4">{student.medium}</Badge>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Droppable Room Card
// // // function DroppableRoom({ room, onRemoveStudent }: { room: Room; onRemoveStudent: (roomId: string, studentId: string) => void }) {
// // //   const { setNodeRef, isOver } = useDroppable({
// // //     id: room.id,
// // //     data: { room }
// // //   });

// // //   const occupancyPercentage = (room.students.length / room.capacity) * 100;
// // //   const statusColor = occupancyPercentage === 100 ? 'bg-red-500' : occupancyPercentage >= 60 ? 'bg-yellow-500' : 'bg-blue-500';
// // //   const statusText = occupancyPercentage === 100 ? 'Full' : 'Occupied';

// // //   return (
// // //     <Card 
// // //       ref={setNodeRef}
// // //       className={`${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''} transition-all`}
// // //     >
// // //       <CardHeader className="pb-2 px-3 pt-3">
// // //         <div className="flex items-center justify-between">
// // //           <CardTitle className="text-base">Room {room.roomNo}</CardTitle>
// // //           <Badge variant={occupancyPercentage === 100 ? "destructive" : "default"} className="text-xs">
// // //             {statusText}
// // //           </Badge>
// // //         </div>
// // //         <div className="mt-2">
// // //           <div className="flex justify-between text-xs text-gray-600 mb-1">
// // //             <span>{room.students.length}/{room.capacity} Members</span>
// // //             <span>{Math.round(occupancyPercentage)}%</span>
// // //           </div>
// // //           <div className="w-full bg-gray-200 rounded-full h-1.5">
// // //             <div 
// // //               className={`h-1.5 rounded-full ${statusColor} transition-all`}
// // //               style={{ width: `${occupancyPercentage}%` }}
// // //             />
// // //           </div>
// // //         </div>
// // //       </CardHeader>
// // //       <CardContent className="px-3 pb-3">
// // //         <div className="space-y-2">
// // //           {room.students.map((student) => (
// // //             <div key={student.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 group hover:bg-gray-100 transition-colors">
// // //               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
// // //                 {student.image}
// // //               </div>
// // //               <div className="flex-1 min-w-0">
// // //                 <p className="text-xs font-semibold truncate">{student.name}</p>
// // //                 <p className="text-xs text-gray-500">{student.studentId}</p>
// // //               </div>
// // //               <button
// // //                 onClick={() => onRemoveStudent(room.id, student.id)}
// // //                 className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1"
// // //                 title="Remove student"
// // //               >
// // //                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // //                 </svg>
// // //               </button>
// // //             </div>
// // //           ))}
// // //           {room.students.length < room.capacity && (
// // //             Array.from({ length: room.capacity - room.students.length }).map((_, idx) => (
// // //               <div key={`vacant-${idx}`} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 opacity-40">
// // //                 <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
// // //                   <User className="w-4 h-4 text-gray-400" />
// // //                 </div>
// // //                 <div className="flex-1">
// // //                   <p className="text-xs text-gray-400">Vacant</p>
// // //                 </div>
// // //               </div>
// // //             ))
// // //           )}
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // }

// // // // Droppable Unassigned Area
// // // function UnassignedArea({ students }: { students: Student[] }) {
// // //   const { setNodeRef, isOver } = useDroppable({
// // //     id: 'unassigned',
// // //   });

// // //   return (
// // //     <div 
// // //       ref={setNodeRef}
// // //       className={`${isOver ? 'bg-blue-50' : ''} transition-colors`}
// // //     >
// // //       {students.length === 0 ? (
// // //         <div className="text-center py-8 text-gray-400">
// // //           <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
// // //           <p className="text-sm">All students assigned</p>
// // //         </div>
// // //       ) : (
// // //         students.map((student) => (
// // //           <DraggableStudent key={student.id} student={student} />
// // //         ))
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default function RoomAllocationDashboard() {
// // //   const [unassignedStudents, setUnassignedStudents] = useState<Student[]>(initialUnassignedStudents);
// // //   const [rooms, setRooms] = useState<Room[]>(initialRooms);
// // //   const [activeId, setActiveId] = useState<string | null>(null);
// // //   const [searchTerm, setSearchTerm] = useState('');

// // //   const sensors = useSensors(
// // //     useSensor(PointerSensor, {
// // //       activationConstraint: {
// // //         distance: 8,
// // //       },
// // //     })
// // //   );

// // //   const handleDragStart = (event: any) => {
// // //     setActiveId(event.active.id);
// // //   };

// // //   const handleRemoveStudent = (roomId: string, studentId: string) => {
// // //     // Find the student in the room
// // //     const room = rooms.find(r => r.id === roomId);
// // //     if (!room) return;
    
// // //     const student = room.students.find(s => s.id === studentId);
// // //     if (!student) return;

// // //     // Remove from room
// // //     setRooms(rooms.map(r => {
// // //       if (r.id === roomId) {
// // //         return { ...r, students: r.students.filter(s => s.id !== studentId) };
// // //       }
// // //       return r;
// // //     }));

// // //     // Add to unassigned
// // //     setUnassignedStudents([...unassignedStudents, student]);
// // //   };

// // //   const handleDragEnd = (event: any) => {
// // //     const { active, over } = event;
// // //     setActiveId(null);

// // //     if (!over) return;

// // //     const studentId = active.id;
// // //     const targetId = over.id;

// // //     // Find the student being dragged
// // //     let student: Student | undefined;
// // //     let sourceRoomId: string | null = null;

// // //     // Check unassigned students
// // //     student = unassignedStudents.find(s => s.id === studentId);
    
// // //     // Check all rooms
// // //     if (!student) {
// // //       for (const room of rooms) {
// // //         student = room.students.find(s => s.id === studentId);
// // //         if (student) {
// // //           sourceRoomId = room.id;
// // //           break;
// // //         }
// // //       }
// // //     }

// // //     if (!student) return;

// // //     // Handle drop on unassigned area
// // //     if (targetId === 'unassigned') {
// // //       if (sourceRoomId) {
// // //         // Remove from room
// // //         setRooms(rooms.map(room => {
// // //           if (room.id === sourceRoomId) {
// // //             return { ...room, students: room.students.filter(s => s.id !== studentId) };
// // //           }
// // //           return room;
// // //         }));
// // //         // Add to unassigned
// // //         setUnassignedStudents([...unassignedStudents, student]);
// // //       }
// // //       return;
// // //     }

// // //     // Handle drop on a room
// // //     const targetRoom = rooms.find(r => r.id === targetId);
// // //     if (!targetRoom) return;

// // //     // Check if room is full
// // //     if (targetRoom.students.length >= targetRoom.capacity) {
// // //       alert('Room is full!');
// // //       return;
// // //     }

// // //     // Remove from source
// // //     if (sourceRoomId) {
// // //       setRooms(rooms.map(room => {
// // //         if (room.id === sourceRoomId) {
// // //           return { ...room, students: room.students.filter(s => s.id !== studentId) };
// // //         }
// // //         if (room.id === targetId) {
// // //           return { ...room, students: [...room.students, student] };
// // //         }
// // //         return room;
// // //       }));
// // //     } else {
// // //       // Remove from unassigned
// // //       setUnassignedStudents(unassignedStudents.filter(s => s.id !== studentId));
// // //       // Add to target room
// // //       setRooms(rooms.map(room => {
// // //         if (room.id === targetId) {
// // //           return { ...room, students: [...room.students, student] };
// // //         }
// // //         return room;
// // //       }));
// // //     }
// // //   };

// // //   const filteredUnassigned = unassignedStudents.filter(student =>
// // //     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //     student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
// // //   );

// // //   const buildings = Array.from(new Set(rooms.map(r => r.building)));

// // //   const activeStudent = activeId 
// // //     ? unassignedStudents.find(s => s.id === activeId) || 
// // //       rooms.flatMap(r => r.students).find(s => s.id === activeId)
// // //     : null;

// // //   return (
// // //     <DndContext
// // //       sensors={sensors}
// // //       collisionDetection={closestCorners}
// // //       onDragStart={handleDragStart}
// // //       onDragEnd={handleDragEnd}
// // //     >
// // //       <div className="min-h-screen bg-gray-50">
// // //         <div className="max-w-full">
// // //           <div className="bg-white border-b px-4 py-3">
// // //             <h1 className="text-2xl font-bold text-gray-900">Room Allocation Dashboard</h1>
// // //             <p className="text-sm text-gray-600">Drag and drop students to assign rooms</p>
// // //           </div>

// // //           <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[calc(100vh-80px)]">
// // //             {/* Left Panel - Unassigned Students */}
// // //             <div className="lg:col-span-1 border-r bg-white overflow-hidden flex flex-col">
// // //               <div className="p-3 border-b">
// // //                 <div className="relative">
// // //                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// // //                   <Input
// // //                     placeholder="Search students..."
// // //                     className="pl-10 h-9"
// // //                     value={searchTerm}
// // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div className="p-3 border-b bg-gray-50">
// // //                 <div className="flex items-center justify-between">
// // //                   <h2 className="font-semibold text-sm flex items-center gap-2">
// // //                     <Users className="w-4 h-4" />
// // //                     Unassigned Students
// // //                   </h2>
// // //                   <Badge variant="secondary" className="text-xs">{filteredUnassigned.length}</Badge>
// // //                 </div>
// // //               </div>
// // //               <div className="flex-1 overflow-y-auto p-3">
// // //                 <UnassignedArea students={filteredUnassigned} />
// // //               </div>
// // //             </div>

// // //             {/* Right Panel - Rooms by Building */}
// // //             <div className="lg:col-span-3 bg-gray-50 overflow-hidden flex flex-col">
// // //               <Tabs defaultValue={buildings[0]} className="w-full h-full flex flex-col">
// // //                 <div className="border-b bg-white px-4 py-2">
// // //                   <TabsList className="grid w-full max-w-md" style={{ gridTemplateColumns: `repeat(${buildings.length}, 1fr)` }}>
// // //                     {buildings.map(building => (
// // //                       <TabsTrigger key={building} value={building} className="flex items-center gap-2 text-sm">
// // //                         <Home className="w-4 h-4" />
// // //                         {building}
// // //                       </TabsTrigger>
// // //                     ))}
// // //                   </TabsList>
// // //                 </div>

// // //                 {buildings.map(building => (
// // //                   <TabsContent key={building} value={building} className="flex-1 overflow-y-auto p-4 m-0">
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
// // //                       {rooms
// // //                         .filter(room => room.building === building)
// // //                         .map(room => (
// // //                           <DroppableRoom key={room.id} room={room} onRemoveStudent={handleRemoveStudent} />
// // //                         ))}
// // //                     </div>
// // //                   </TabsContent>
// // //                 ))}
// // //               </Tabs>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <DragOverlay>
// // //         {activeStudent && (
// // //           <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-xl rotate-3">
// // //             <div className="flex items-center gap-2">
// // //               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
// // //                 {activeStudent.image}
// // //               </div>
// // //               <div className="flex-1">
// // //                 <h3 className="font-semibold text-xs">{activeStudent.name}</h3>
// // //                 <p className="text-xs text-gray-500">{activeStudent.studentId}</p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </DragOverlay>
// // //     </DndContext>
// // //   );
// // // }




// // // // "use client";
// // // // import React, { useState } from 'react';
// // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// // // // import { useDraggable, useDroppable } from '@dnd-kit/core';
// // // // import { Search, User, Home, Users } from 'lucide-react';

// // // // // Types
// // // // interface Student {
// // // //   id: string;
// // // //   name: string;
// // // //   studentId: string;
// // // //   std: string;
// // // //   medium: string;
// // // //   image: string;
// // // //   roomId?: string;
// // // // }

// // // // interface Room {
// // // //   id: string;
// // // //   roomNo: string;
// // // //   capacity: number;
// // // //   building: string;
// // // //   students: Student[];
// // // // }

// // // // // Sample Data
// // // // const initialUnassignedStudents: Student[] = [
// // // //   { id: '1', name: 'Alex Johnson', studentId: '#12345', std: '10th', medium: 'English', image: 'AJ' },
// // // //   { id: '2', name: 'Ben Carter', studentId: '#12346', std: '11th', medium: 'English', image: 'BC' },
// // // //   { id: '3', name: 'Charlie Davis', studentId: '#12347', std: '9th', medium: 'Hindi', image: 'CD' },
// // // //   { id: '4', name: 'David Miller', studentId: '#12348', std: '10th', medium: 'English', image: 'DM' },
// // // //   { id: '5', name: 'Ethan Wilson', studentId: '#12349', std: '11th', medium: 'Gujarati', image: 'EW' },
// // // // ];

// // // // const initialRooms: Room[] = [
// // // //   {
// // // //     id: 'room-101',
// // // //     roomNo: '101',
// // // //     capacity: 4,
// // // //     building: 'Building A',
// // // //     students: [
// // // //       { id: '6', name: 'John Doe', studentId: '#12350', std: '10th', medium: 'English', image: 'JD' },
// // // //       { id: '7', name: 'Jane Smith', studentId: '#12351', std: '11th', medium: 'Hindi', image: 'JS' },
// // // //       { id: '8', name: 'Peter Jones', studentId: '#12352', std: '9th', medium: 'English', image: 'PJ' },
// // // //       { id: '9', name: 'Emily White', studentId: '#12353', std: '10th', medium: 'Gujarati', image: 'EW' },
// // // //     ]
// // // //   },
// // // //   {
// // // //     id: 'room-102',
// // // //     roomNo: '102',
// // // //     capacity: 5,
// // // //     building: 'Building A',
// // // //     students: [
// // // //       { id: '10', name: 'Sarah Brown', studentId: '#12354', std: '11th', medium: 'English', image: 'SB' },
// // // //       { id: '11', name: 'Mike Davis', studentId: '#12355', std: '10th', medium: 'Hindi', image: 'MD' },
// // // //     ]
// // // //   },
// // // //   {
// // // //     id: 'room-201',
// // // //     roomNo: '201',
// // // //     capacity: 4,
// // // //     building: 'Building B',
// // // //     students: []
// // // //   },
// // // //   {
// // // //     id: 'room-202',
// // // //     roomNo: '202',
// // // //     capacity: 6,
// // // //     building: 'Building B',
// // // //     students: [
// // // //       { id: '12', name: 'Lisa Anderson', studentId: '#12356', std: '9th', medium: 'English', image: 'LA' },
// // // //     ]
// // // //   },
// // // // ];

// // // // // Draggable Student Card
// // // // function DraggableStudent({ student }: { student: Student }) {
// // // //   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
// // // //     id: student.id,
// // // //     data: { student }
// // // //   });

// // // //   const style = transform ? {
// // // //     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
// // // //     opacity: isDragging ? 0.5 : 1,
// // // //   } : undefined;

// // // //   return (
// // // //     <div
// // // //       ref={setNodeRef}
// // // //       style={style}
// // // //       {...listeners}
// // // //       {...attributes}
// // // //       className="bg-white border rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
// // // //     >
// // // //       <div className="flex items-center gap-3">
// // // //         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
// // // //           {student.image}
// // // //         </div>
// // // //         <div className="flex-1 min-w-0">
// // // //           <h3 className="font-semibold text-sm truncate">{student.name}</h3>
// // // //           <p className="text-xs text-gray-500">{student.studentId}</p>
// // // //           <div className="flex gap-1 mt-1">
// // // //             <Badge variant="secondary" className="text-xs">{student.std}</Badge>
// // // //             <Badge variant="outline" className="text-xs">{student.medium}</Badge>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // // Droppable Room Card
// // // // function DroppableRoom({ room }: { room: Room }) {
// // // //   const { setNodeRef, isOver } = useDroppable({
// // // //     id: room.id,
// // // //     data: { room }
// // // //   });

// // // //   const occupancyPercentage = (room.students.length / room.capacity) * 100;
// // // //   const statusColor = occupancyPercentage === 100 ? 'bg-red-500' : occupancyPercentage >= 60 ? 'bg-yellow-500' : 'bg-blue-500';
// // // //   const statusText = occupancyPercentage === 100 ? 'Full' : 'Occupied';

// // // //   return (
// // // //     <Card 
// // // //       ref={setNodeRef}
// // // //       className={`${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''} transition-all`}
// // // //     >
// // // //       <CardHeader className="pb-3">
// // // //         <div className="flex items-center justify-between">
// // // //           <CardTitle className="text-lg">Room {room.roomNo}</CardTitle>
// // // //           <Badge variant={occupancyPercentage === 100 ? "destructive" : "default"}>
// // // //             {statusText}
// // // //           </Badge>
// // // //         </div>
// // // //         <div className="mt-2">
// // // //           <div className="flex justify-between text-xs text-gray-600 mb-1">
// // // //             <span>{room.students.length}/{room.capacity} Members</span>
// // // //             <span>{Math.round(occupancyPercentage)}%</span>
// // // //           </div>
// // // //           <div className="w-full bg-gray-200 rounded-full h-2">
// // // //             <div 
// // // //               className={`h-2 rounded-full ${statusColor} transition-all`}
// // // //               style={{ width: `${occupancyPercentage}%` }}
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //       </CardHeader>
// // // //       <CardContent>
// // // //         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
// // // //           {room.students.map((student) => (
// // // //             <div key={student.id} className="text-center">
// // // //               <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold mb-1">
// // // //                 {student.image}
// // // //               </div>
// // // //               <p className="text-xs font-medium truncate">{student.name}</p>
// // // //               <p className="text-xs text-gray-500">{student.studentId}</p>
// // // //             </div>
// // // //           ))}
// // // //           {room.students.length < room.capacity && (
// // // //             Array.from({ length: room.capacity - room.students.length }).map((_, idx) => (
// // // //               <div key={`vacant-${idx}`} className="text-center opacity-40">
// // // //                 <div className="w-12 h-12 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-1">
// // // //                   <User className="w-6 h-6 text-gray-400" />
// // // //                 </div>
// // // //                 <p className="text-xs text-gray-400">Vacant</p>
// // // //               </div>
// // // //             ))
// // // //           )}
// // // //         </div>
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // }

// // // // // Droppable Unassigned Area
// // // // function UnassignedArea({ students }: { students: Student[] }) {
// // // //   const { setNodeRef, isOver } = useDroppable({
// // // //     id: 'unassigned',
// // // //   });

// // // //   return (
// // // //     <Card className="h-full">
// // // //       <CardHeader>
// // // //         <CardTitle className="flex items-center gap-2">
// // // //           <Users className="w-5 h-5" />
// // // //           Unassigned Students
// // // //           <Badge variant="secondary">{students.length}</Badge>
// // // //         </CardTitle>
// // // //       </CardHeader>
// // // //       <CardContent 
// // // //         ref={setNodeRef}
// // // //         className={`max-h-[calc(100vh-12rem)] overflow-y-auto ${isOver ? 'bg-blue-50' : ''}`}
// // // //       >
// // // //         {students.length === 0 ? (
// // // //           <div className="text-center py-8 text-gray-400">
// // // //             <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
// // // //             <p>All students assigned</p>
// // // //           </div>
// // // //         ) : (
// // // //           students.map((student) => (
// // // //             <DraggableStudent key={student.id} student={student} />
// // // //           ))
// // // //         )}
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // }

// // // // export default function RoomAllocationDashboard() {
// // // //   const [unassignedStudents, setUnassignedStudents] = useState<Student[]>(initialUnassignedStudents);
// // // //   const [rooms, setRooms] = useState<Room[]>(initialRooms);
// // // //   const [activeId, setActiveId] = useState<string | null>(null);
// // // //   const [searchTerm, setSearchTerm] = useState('');

// // // //   const sensors = useSensors(
// // // //     useSensor(PointerSensor, {
// // // //       activationConstraint: {
// // // //         distance: 8,
// // // //       },
// // // //     })
// // // //   );

// // // //   const handleDragStart = (event: any) => {
// // // //     setActiveId(event.active.id);
// // // //   };

// // // //   const handleDragEnd = (event: any) => {
// // // //     const { active, over } = event;
// // // //     setActiveId(null);

// // // //     if (!over) return;

// // // //     const studentId = active.id;
// // // //     const targetId = over.id;

// // // //     // Find the student being dragged
// // // //     let student: Student | undefined;
// // // //     let sourceRoomId: string | null = null;

// // // //     // Check unassigned students
// // // //     student = unassignedStudents.find(s => s.id === studentId);
    
// // // //     // Check all rooms
// // // //     if (!student) {
// // // //       for (const room of rooms) {
// // // //         student = room.students.find(s => s.id === studentId);
// // // //         if (student) {
// // // //           sourceRoomId = room.id;
// // // //           break;
// // // //         }
// // // //       }
// // // //     }

// // // //     if (!student) return;

// // // //     // Handle drop on unassigned area
// // // //     if (targetId === 'unassigned') {
// // // //       if (sourceRoomId) {
// // // //         // Remove from room
// // // //         setRooms(rooms.map(room => {
// // // //           if (room.id === sourceRoomId) {
// // // //             return { ...room, students: room.students.filter(s => s.id !== studentId) };
// // // //           }
// // // //           return room;
// // // //         }));
// // // //         // Add to unassigned
// // // //         setUnassignedStudents([...unassignedStudents, student]);
// // // //       }
// // // //       return;
// // // //     }

// // // //     // Handle drop on a room
// // // //     const targetRoom = rooms.find(r => r.id === targetId);
// // // //     if (!targetRoom) return;

// // // //     // Check if room is full
// // // //     if (targetRoom.students.length >= targetRoom.capacity) {
// // // //       alert('Room is full!');
// // // //       return;
// // // //     }

// // // //     // Remove from source
// // // //     if (sourceRoomId) {
// // // //       setRooms(rooms.map(room => {
// // // //         if (room.id === sourceRoomId) {
// // // //           return { ...room, students: room.students.filter(s => s.id !== studentId) };
// // // //         }
// // // //         if (room.id === targetId) {
// // // //           return { ...room, students: [...room.students, student] };
// // // //         }
// // // //         return room;
// // // //       }));
// // // //     } else {
// // // //       // Remove from unassigned
// // // //       setUnassignedStudents(unassignedStudents.filter(s => s.id !== studentId));
// // // //       // Add to target room
// // // //       setRooms(rooms.map(room => {
// // // //         if (room.id === targetId) {
// // // //           return { ...room, students: [...room.students, student] };
// // // //         }
// // // //         return room;
// // // //       }));
// // // //     }
// // // //   };

// // // //   const filteredUnassigned = unassignedStudents.filter(student =>
// // // //     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //     student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
// // // //   );

// // // //   const buildings = Array.from(new Set(rooms.map(r => r.building)));

// // // //   const activeStudent = activeId 
// // // //     ? unassignedStudents.find(s => s.id === activeId) || 
// // // //       rooms.flatMap(r => r.students).find(s => s.id === activeId)
// // // //     : null;

// // // //   return (
// // // //     <DndContext
// // // //       sensors={sensors}
// // // //       collisionDetection={closestCorners}
// // // //       onDragStart={handleDragStart}
// // // //       onDragEnd={handleDragEnd}
// // // //     >
// // // //       <div className="min-h-screen bg-gray-50 p-4">
// // // //         <div className="max-w-7xl mx-auto">
// // // //           <div className="mb-6">
// // // //             <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Allocation Dashboard</h1>
// // // //             <p className="text-gray-600">Drag and drop students to assign rooms</p>
// // // //           </div>

// // // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // // //             {/* Left Panel - Unassigned Students */}
// // // //             <div className="lg:col-span-1">
// // // //               <div className="mb-4">
// // // //                 <div className="relative">
// // // //                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// // // //                   <Input
// // // //                     placeholder="Search students..."
// // // //                     className="pl-10"
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               <UnassignedArea students={filteredUnassigned} />
// // // //             </div>

// // // //             {/* Right Panel - Rooms by Building */}
// // // //             <div className="lg:col-span-2">
// // // //               <Tabs defaultValue={buildings[0]} className="w-full">
// // // //                 <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${buildings.length}, 1fr)` }}>
// // // //                   {buildings.map(building => (
// // // //                     <TabsTrigger key={building} value={building} className="flex items-center gap-2">
// // // //                       <Home className="w-4 h-4" />
// // // //                       {building}
// // // //                     </TabsTrigger>
// // // //                   ))}
// // // //                 </TabsList>

// // // //                 {buildings.map(building => (
// // // //                   <TabsContent key={building} value={building} className="mt-4">
// // // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                       {rooms
// // // //                         .filter(room => room.building === building)
// // // //                         .map(room => (
// // // //                           <DroppableRoom key={room.id} room={room} />
// // // //                         ))}
// // // //                     </div>
// // // //                   </TabsContent>
// // // //                 ))}
// // // //               </Tabs>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <DragOverlay>
// // // //         {activeStudent && (
// // // //           <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-xl rotate-3">
// // // //             <div className="flex items-center gap-3">
// // // //               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
// // // //                 {activeStudent.image}
// // // //               </div>
// // // //               <div className="flex-1">
// // // //                 <h3 className="font-semibold text-sm">{activeStudent.name}</h3>
// // // //                 <p className="text-xs text-gray-500">{activeStudent.studentId}</p>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </DragOverlay>
// // // //     </DndContext>
// // // //   );
// // // // }

// // // // // import MainLayout from '@/components/layout/main-layout'
// // // // // import React from 'react'

// // // // // export default function RoomAllocation() {
// // // // //     return (
// // // // //         <MainLayout
// // // // //             title="Room Allocation"
// // // // //             subtitle="Room Allocation"

// // // // //         >
// // // // //             <div className='flex text-4xl justify-center items-center min-h-1/2'>
// // // // //                 You will get this feature soon
// // // // //             </div>
// // // // //         </MainLayout>
// // // // //     )
// // // // // }
