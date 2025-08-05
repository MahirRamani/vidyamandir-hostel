// import { create } from "zustand"
// import { devtools } from "zustand/middleware"
// import type { IBuilding } from "@/types/building"
// import type { RoomWithStudents } from "@/types/room"
// import type { IStudent } from "@/types/student"

// interface RoomState {
//   buildings: IBuilding[]
//   rooms: RoomWithStudents[]
//   students: IStudent[]
//   selectedBuilding: IBuilding | null
//   selectedRoom: RoomWithStudents | null
//   isLoading: boolean
//   error: string | null
//   searchQuery: string

//   // Actions
//   setBuildings: (buildings: IBuilding[]) => void
//   setRooms: (rooms: RoomWithStudents[]) => void
//   setStudents: (students: IStudent[]) => void
//   setSelectedBuilding: (building: IBuilding | null) => void
//   setSelectedRoom: (room: RoomWithStudents | null) => void
//   setLoading: (loading: boolean) => void
//   setError: (error: string | null) => void
//   setSearchQuery: (query: string) => void
//   addBuilding: (building: IBuilding) => void
//   updateBuilding: (id: string, building: Partial<IBuilding>) => void
//   removeBuilding: (id: string) => void
//   addRoom: (room: RoomWithStudents) => void
//   updateRoom: (id: string, room: Partial<RoomWithStudents>) => void
//   removeRoom: (id: string) => void
//   updateStudentRoom: (studentId: string, roomId: string | null, bedNo?: number) => void
//   clearError: () => void
// }

// export const useRoomStore = create<RoomState>()(
//   devtools(
//     (set, get) => ({
//       buildings: [],
//       rooms: [],
//       students: [],
//       selectedBuilding: null,
//       selectedRoom: null,
//       isLoading: false,
//       error: null,
//       searchQuery: "",

//       setBuildings: (buildings) => set({ buildings }),
//       setRooms: (rooms) => set({ rooms }),
//       setStudents: (students) => set({ students }),
//       setSelectedBuilding: (building) => set({ selectedBuilding: building }),
//       setSelectedRoom: (room) => set({ selectedRoom: room }),
//       setLoading: (loading) => set({ isLoading: loading }),
//       setError: (error) => set({ error }),
//       setSearchQuery: (query) => set({ searchQuery: query }),

//       addBuilding: (building) =>
//         set((state) => ({
//           buildings: [...state.buildings, building],
//         })),

//       updateBuilding: (id, updatedBuilding) =>
//         set((state) => ({
//           buildings: state.buildings.map((building) =>
//             building._id === id ? { ...building, ...updatedBuilding } : building,
//           ),
//         })),

//       removeBuilding: (id) =>
//         set((state) => ({
//           buildings: state.buildings.filter((building) => building._id !== id),
//           rooms: state.rooms.filter((room) => room.buildingId !== id),
//         })),

//       addRoom: (room) =>
//         set((state) => ({
//           rooms: [...state.rooms, room],
//         })),

//       updateRoom: (id, updatedRoom) =>
//         set((state) => ({
//           rooms: state.rooms.map((room) => (room._id === id ? { ...room, ...updatedRoom } : room)),
//         })),

//       removeRoom: (id) =>
//         set((state) => ({
//           rooms: state.rooms.filter((room) => room._id !== id),
//         })),

//       updateStudentRoom: (studentId, roomId, bedNo) =>
//         set((state) => ({
//           students: state.students.map((student) =>
//             student._id === studentId ? { ...student, roomId, bedNo } : student,
//           ),
//           rooms: state.rooms.map((room) => {
//             if (room._id === roomId) {
//               // Add student to room
//               const student = state.students.find((s) => s._id === studentId)
//               if (student) {
//                 return {
//                   ...room,
//                   students: [...room.students, { ...student, bedNo }],
//                   occupiedBeds: room.occupiedBeds + 1,
//                 }
//               }
//             } else {
//               // Remove student from other rooms
//               return {
//                 ...room,
//                 students: room.students.filter((s) => s._id !== studentId),
//                 occupiedBeds: Math.max(0, room.occupiedBeds - 1),
//               }
//             }
//             return room
//           }),
//         })),

//       clearError: () => set({ error: null }),
//     }),
//     { name: "room-store" },
//   ),
// )
