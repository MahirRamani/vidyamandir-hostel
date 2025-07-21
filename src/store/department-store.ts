import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { IDepartment } from "@/types/department"
import type { IStudent } from "@/types/student"

interface DepartmentState {
  departments: IDepartment[]
  students: IStudent[]
  selectedDepartment: IDepartment | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  assignmentFilter: "all" | "assigned" | "unassigned"

  // Actions
  setDepartments: (departments: IDepartment[]) => void
  setStudents: (students: IStudent[]) => void
  setSelectedDepartment: (department: IDepartment | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setAssignmentFilter: (filter: "all" | "assigned" | "unassigned") => void
  addDepartment: (department: IDepartment) => void
  updateDepartment: (id: string, department: Partial<IDepartment>) => void
  removeDepartment: (id: string) => void
  updateStudentDepartment: (studentId: string, departmentId: string | null) => void
  clearError: () => void
}

export const useDepartmentStore = create<DepartmentState>()(
  devtools(
    (set, get) => ({
      departments: [],
      students: [],
      selectedDepartment: null,
      isLoading: false,
      error: null,
      searchQuery: "",
      assignmentFilter: "all",

      setDepartments: (departments) => set({ departments }),
      setStudents: (students) => set({ students }),
      setSelectedDepartment: (department) => set({ selectedDepartment: department }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, department],
        })),

      updateDepartment: (id, updatedDepartment) =>
        set((state) => ({
          departments: state.departments.map((dept) => (dept._id === id ? { ...dept, ...updatedDepartment } : dept)),
        })),

      removeDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((dept) => dept._id !== id),
        })),

      updateStudentDepartment: (studentId, departmentId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student._id === studentId ? { ...student, departmentId } : student,
          ),
        })),

      clearError: () => set({ error: null }),
    }),
    { name: "department-store" },
  ),
)
