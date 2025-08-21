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
  // Updated methods for multiple departments
  updateStudentDepartment: (studentId: string, departmentId: string | null) => void // Keep for backward compatibility
  updateStudentDepartments: (studentId: string, departmentIds: string[] | null) => void // New method
  addStudentToDepartment: (studentId: string, departmentId: string) => void
  removeStudentFromDepartment: (studentId: string, departmentId: string) => void
  clearError: () => void
}

// Simple helper to convert any object to plain object (strips Mongoose methods)
const toPlainObject = <T>(obj: unknown): T => {
  if (!obj) return obj as T
  const doc = obj as { toObject?: () => T; toJSON?: () => T }
  if (doc.toObject) return doc.toObject()
  if (doc.toJSON) return doc.toJSON()
  return JSON.parse(JSON.stringify(obj)) as T
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

      setDepartments: (departments) =>
        set({ departments: departments.map(dept => toPlainObject<IDepartment>(dept)) }),

      setStudents: (students) =>
        set({ students: students.map(student => toPlainObject<IStudent>(student)) }),

      setSelectedDepartment: (department) =>
        set({ selectedDepartment: department ? toPlainObject<IDepartment>(department) : null }),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, toPlainObject<IDepartment>(department)],
        })),

      updateDepartment: (id, updatedDepartment) =>
        set((state) => ({
          departments: state.departments.map((dept) =>
            dept._id === id ? { ...dept, ...toPlainObject<Partial<IDepartment>>(updatedDepartment) } : dept
          ),
        })),

      removeDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((dept) => dept._id !== id),
        })),

      // Keep backward compatibility for single department
      updateStudentDepartment: (studentId, departmentId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student._id === studentId
              ? {
                ...student,
                departmentId,
                departmentIds: departmentId ? [departmentId] : []
              }
              : student,
          ),
        })),

      // New method for multiple departments
      updateStudentDepartments: (studentId, departmentIds) =>
        set((state) => ({
          students: state.students.map((student) =>
            student._id === studentId
              ? {
                ...student,
                departmentIds: departmentIds || [],
                departmentId: departmentIds && departmentIds.length > 0 ? departmentIds[0] : null // Keep first department for backward compatibility
              }
              : student,
          ),
        })),

      // Add student to a department (for multiple departments)
      addStudentToDepartment: (studentId, departmentId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student._id === studentId
              ? {
                ...student,
                departmentIds: [...(student.departmentIds || []), departmentId],
                departmentId: student.departmentId || departmentId // Set primary if none exists
              }
              : student,
          ),
        })),

      // Remove student from a specific department
      // removeStudentFromDepartment: (studentId, departmentId) =>
      //   set((state) => ({
      //     students: state.students.map((student) => {
      //       if (student._id === studentId) {
      //         const newDepartmentIds = (student.departmentIds || []).filter(id => id !== departmentId)
      //         return {
      //           ...student,
      //           departmentIds: newDepartmentIds,
      //           departmentId: newDepartmentIds.length > 0 ? newDepartmentIds[0] : null
      //         }
      //       }
      //       return student
      //     }),
      //   })),

      // FIXED: Updated removeStudentFromDepartment method in department store

      removeStudentFromDepartment: (studentId: string, departmentId: string) =>
        set((state) => ({
          students: state.students.map((student) => {
            if (student._id === studentId) {
              // Get current department IDs, handling both old and new formats
              let currentDepartmentIds: string[] = [];
              if (student.departmentIds && student.departmentIds.length > 0) {
                currentDepartmentIds = [...student.departmentIds];
              } else if (student.departmentId) {
                currentDepartmentIds = [student.departmentId];
              }

              // Remove the specific department ID
              const newDepartmentIds = currentDepartmentIds.filter(
                (id: string) => id?.toString() !== departmentId?.toString()
              );

              // Update primary department if it was removed
              let newPrimaryDepartment: string | null = student.departmentId;
              if (student.departmentId?.toString() === departmentId?.toString()) {
                newPrimaryDepartment = newDepartmentIds.length > 0 ? newDepartmentIds[0] : null;
              }

              return {
                ...student,
                departmentIds: newDepartmentIds,
                departmentId: newPrimaryDepartment,
              };
            }
            return student;
          }),
        })),

      clearError: () => set({ error: null }),
    }),
    { name: "department-store" },
  ),
)



// import { create } from "zustand"
// import { devtools } from "zustand/middleware"
// import type { IDepartment } from "@/types/department"
// import type { IStudent } from "@/types/student"

// interface DepartmentState {
//   departments: IDepartment[]
//   students: IStudent[]
//   selectedDepartment: IDepartment | null
//   isLoading: boolean
//   error: string | null
//   searchQuery: string
//   assignmentFilter: "all" | "assigned" | "unassigned"

//   // Actions
//   setDepartments: (departments: IDepartment[]) => void
//   setStudents: (students: IStudent[]) => void
//   setSelectedDepartment: (department: IDepartment | null) => void
//   setLoading: (loading: boolean) => void
//   setError: (error: string | null) => void
//   setSearchQuery: (query: string) => void
//   setAssignmentFilter: (filter: "all" | "assigned" | "unassigned") => void
//   addDepartment: (department: IDepartment) => void
//   updateDepartment: (id: string, department: Partial<IDepartment>) => void
//   removeDepartment: (id: string) => void
//   updateStudentDepartment: (studentId: string, departmentId: string | null) => void
//   clearError: () => void
// }

// // Simple helper to convert any object to plain object (strips Mongoose methods)
// const toPlainObject = <T>(obj: unknown): T => {
//   if (!obj) return obj as T
//   const doc = obj as { toObject?: () => T; toJSON?: () => T }
//   if (doc.toObject) return doc.toObject()
//   if (doc.toJSON) return doc.toJSON()
//   return JSON.parse(JSON.stringify(obj)) as T
// }

// export const useDepartmentStore = create<DepartmentState>()(
//   devtools(
//     (set, get) => ({
//       departments: [],
//       students: [],
//       selectedDepartment: null,
//       isLoading: false,
//       error: null,
//       searchQuery: "",
//       assignmentFilter: "all",

//       setDepartments: (departments) =>
//         set({ departments: departments.map(dept => toPlainObject<IDepartment>(dept)) }),

//       setStudents: (students) =>
//         set({ students: students.map(student => toPlainObject<IStudent>(student)) }),

//       setSelectedDepartment: (department) =>
//         set({ selectedDepartment: department ? toPlainObject<IDepartment>(department) : null }),

//       setLoading: (loading) => set({ isLoading: loading }),
//       setError: (error) => set({ error }),
//       setSearchQuery: (query) => set({ searchQuery: query }),
//       setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

//       addDepartment: (department) =>
//         set((state) => ({
//           departments: [...state.departments, toPlainObject<IDepartment>(department)],
//         })),

//       updateDepartment: (id, updatedDepartment) =>
//         set((state) => ({
//           departments: state.departments.map((dept) =>
//             dept._id === id ? { ...dept, ...toPlainObject<Partial<IDepartment>>(updatedDepartment) } : dept
//           ),
//         })),

//       removeDepartment: (id) =>
//         set((state) => ({
//           departments: state.departments.filter((dept) => dept._id !== id),
//         })),

//       updateStudentDepartment: (studentId, departmentId) =>
//         set((state) => ({
//           students: state.students.map((student) =>
//             student._id === studentId ? { ...student, departmentId } : student,
//           ),
//         })),

//       clearError: () => set({ error: null }),
//     }),
//     { name: "department-store" },
//   ),
// )