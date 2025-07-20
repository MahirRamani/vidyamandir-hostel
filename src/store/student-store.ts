import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { IStudent } from "@/types/student"

interface StudentState {
  students: IStudent[]
  currentStudent: IStudent | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  statusFilter: string

  // Actions
  setStudents: (students: IStudent[]) => void
  setCurrentStudent: (student: IStudent | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  addStudent: (student: IStudent) => void
  updateStudent: (id: string, student: Partial<IStudent>) => void
  removeStudent: (id: string) => void
  clearError: () => void
}

export const useStudentStore = create<StudentState>()(
  devtools(
    (set, get) => ({
      students: [],
      currentStudent: null,
      isLoading: false,
      error: null,
      searchQuery: "",
      statusFilter: "all",

      setStudents: (students) => set({ students }),
      setCurrentStudent: (student) => set({ currentStudent: student }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),

      addStudent: (student) =>
        set((state) => ({
          students: [...state.students, student],
        })),

      updateStudent: (id, updatedStudent) =>
        set((state) => ({
          students: state.students.map((student) => (student._id === id ? { ...student, ...updatedStudent } : student)),
        })),

      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter((student) => student._id !== id),
        })),

      clearError: () => set({ error: null }),
    }),
    { name: "student-store" },
  ),
)
