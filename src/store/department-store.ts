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
// import { create } from "zustand"
// import { devtools } from "zustand/middleware"
// import type { IDepartment } from "@/types/department"
// import type { IStudent } from "@/types/student"

// // Simple approach: use the original types but convert at runtime
// type PlainDepartment = {
//   _id: string
//   name: string
//   HOD?: string
//   subHOD?: string
//   description: string
//   createdAt: Date
//   updatedAt: Date
//   // [key: string]: unknown // Allow for additional properties
// }

// type PlainStudent = {
//   _id: string
//   departmentId: string | null
//   name: {
//     firstName: string
//     middleName: string
//     lastName: string
//   }
//   studentId: string
//   profileImageUrl: string
//   dateOfBirth: Date
//   hobbies: string[]
//   skills: string[]
//   [key: string]: unknown // Allow for additional properties
// }

// interface DepartmentState {
//   departments: PlainDepartment[]
//   students: PlainStudent[]
//   selectedDepartment: PlainDepartment | null
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

// // Helper functions to convert Mongoose documents to plain objects
// const toPlainDepartment = (dept: unknown): PlainDepartment => {
//   if (!dept) return dept as PlainDepartment
//   const doc = dept as { toObject?: () => PlainDepartment; toJSON?: () => PlainDepartment }
//   if (doc.toObject) return doc.toObject()
//   if (doc.toJSON) return doc.toJSON()
//   return JSON.parse(JSON.stringify(dept)) as PlainDepartment
// }

// const toPlainStudent = (student: unknown): PlainStudent => {
//   if (!student) return student as PlainStudent
//   const doc = student as { toObject?: () => PlainStudent; toJSON?: () => PlainStudent }
//   if (doc.toObject) return doc.toObject()
//   if (doc.toJSON) return doc.toJSON()
//   return JSON.parse(JSON.stringify(student)) as PlainStudent
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
//         set({ departments: departments.map(toPlainDepartment) }),
      
//       setStudents: (students) => 
//         set({ students: students.map(toPlainStudent) }),
      
//       setSelectedDepartment: (department) => 
//         set({ selectedDepartment: department ? toPlainDepartment(department) : null }),
      
//       setLoading: (loading) => set({ isLoading: loading }),
//       setError: (error) => set({ error }),
//       setSearchQuery: (query) => set({ searchQuery: query }),
//       setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

//       addDepartment: (department) =>
//         set((state) => ({
//           departments: [...state.departments, toPlainDepartment(department)],
//         })),

//       updateDepartment: (id, updatedDepartment) =>
//         set((state) => ({
//           departments: state.departments.map((dept) => 
//             dept._id === id ? { ...dept, ...toPlainDepartment(updatedDepartment) } : dept
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
// )// import { create } from "zustand"
// // import { devtools } from "zustand/middleware"
// // import type { IDepartment } from "@/types/department"
// // import type { IStudent } from "@/types/student"

// // interface DepartmentState {
// //   departments: IDepartment[]
// //   students: IStudent[]
// //   selectedDepartment: IDepartment | null
// //   isLoading: boolean
// //   error: string | null
// //   searchQuery: string
// //   assignmentFilter: "all" | "assigned" | "unassigned"

// //   // Actions
// //   setDepartments: (departments: IDepartment[]) => void
// //   setStudents: (students: IStudent[]) => void
// //   setSelectedDepartment: (department: IDepartment | null) => void
// //   setLoading: (loading: boolean) => void
// //   setError: (error: string | null) => void
// //   setSearchQuery: (query: string) => void
// //   setAssignmentFilter: (filter: "all" | "assigned" | "unassigned") => void
// //   addDepartment: (department: IDepartment) => void
// //   updateDepartment: (id: string, department: Partial<IDepartment>) => void
// //   removeDepartment: (id: string) => void
// //   updateStudentDepartment: (studentId: string, departmentId: string | null) => void
// //   clearError: () => void
// // }

// // // Helper functions to convert Mongoose documents to plain objects
// // const toPlainDepartment = (dept: unknown): IDepartment => {
// //   if (!dept) return dept as IDepartment
// //   const doc = dept as { toObject?: () => IDepartment; toJSON?: () => IDepartment }
// //   if (doc.toObject) return doc.toObject()
// //   if (doc.toJSON) return doc.toJSON()
// //   return JSON.parse(JSON.stringify(dept)) as IDepartment
// // }

// // const toPlainStudent = (student: unknown): IStudent => {
// //   if (!student) return student as IStudent
// //   const doc = student as { toObject?: () => IStudent; toJSON?: () => IStudent }
// //   if (doc.toObject) return doc.toObject()
// //   if (doc.toJSON) return doc.toJSON()
// //   return JSON.parse(JSON.stringify(student)) as IStudent
// // }

// // export const useDepartmentStore = create<DepartmentState>()(
// //   devtools(
// //     (set, get) => ({
// //       departments: [],
// //       students: [],
// //       selectedDepartment: null,
// //       isLoading: false,
// //       error: null,
// //       searchQuery: "",
// //       assignmentFilter: "all",

// //       setDepartments: (departments) => 
// //         set({ departments: departments.map(toPlainDepartment) }),
      
// //       setStudents: (students) => 
// //         set({ students: students.map(toPlainStudent) }),
      
// //       setSelectedDepartment: (department) => 
// //         set({ selectedDepartment: department ? toPlainDepartment(department) : null }),
      
// //       setLoading: (loading) => set({ isLoading: loading }),
// //       setError: (error) => set({ error }),
// //       setSearchQuery: (query) => set({ searchQuery: query }),
// //       setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

// //       addDepartment: (department) =>
// //         set((state) => ({
// //           departments: [...state.departments, toPlainDepartment(department)],
// //         })),

// //       updateDepartment: (id, updatedDepartment) =>
// //         set((state) => ({
// //           departments: state.departments.map((dept) => 
// //             dept._id === id ? { ...dept, ...toPlainDepartment(updatedDepartment) } : dept
// //           ),
// //         })),

// //       removeDepartment: (id) =>
// //         set((state) => ({
// //           departments: state.departments.filter((dept) => dept._id !== id),
// //         })),

// //       updateStudentDepartment: (studentId, departmentId) =>
// //         set((state) => ({
// //           students: state.students.map((student) =>
// //             student._id === studentId ? { ...student, departmentId } : student,
// //           ),
// //         })),

// //       clearError: () => set({ error: null }),
// //     }),
// //     { name: "department-store" },
// //   ),
// // )// import { create } from "zustand"
// // import { devtools } from "zustand/middleware"
// // import type { IDepartment } from "@/types/department"
// // import type { IStudent } from "@/types/student"

// // interface DepartmentState {
// //   departments: IDepartment[]
// //   students: IStudent[]
// //   selectedDepartment: IDepartment | null
// //   isLoading: boolean
// //   error: string | null
// //   searchQuery: string
// //   assignmentFilter: "all" | "assigned" | "unassigned"

// //   // Actions
// //   setDepartments: (departments: IDepartment[]) => void
// //   setStudents: (students: IStudent[]) => void
// //   setSelectedDepartment: (department: IDepartment | null) => void
// //   setLoading: (loading: boolean) => void
// //   setError: (error: string | null) => void
// //   setSearchQuery: (query: string) => void
// //   setAssignmentFilter: (filter: "all" | "assigned" | "unassigned") => void
// //   addDepartment: (department: IDepartment) => void
// //   updateDepartment: (id: string, department: Partial<IDepartment>) => void
// //   removeDepartment: (id: string) => void
// //   updateStudentDepartment: (studentId: string, departmentId: string | null) => void
// //   clearError: () => void
// // }

// // export const useDepartmentStore = create<DepartmentState>()(
// //   devtools(
// //     (set, get) => ({
// //       departments: [],
// //       students: [],
// //       selectedDepartment: null,
// //       isLoading: false,
// //       error: null,
// //       searchQuery: "",
// //       assignmentFilter: "all",

// //       setDepartments: (departments) => set({ departments }),
// //       setStudents: (students) => set({ students }),
// //       setSelectedDepartment: (department) => set({ selectedDepartment: department }),
// //       setLoading: (loading) => set({ isLoading: loading }),
// //       setError: (error) => set({ error }),
// //       setSearchQuery: (query) => set({ searchQuery: query }),
// //       setAssignmentFilter: (filter) => set({ assignmentFilter: filter }),

// //       addDepartment: (department) =>
// //         set((state) => ({
// //           departments: [...state.departments, department],
// //         })),

// //       updateDepartment: (id, updatedDepartment) =>
// //         set((state) => ({
// //           departments: state.departments.map((dept) => (dept._id === id ? { ...dept, ...updatedDepartment } : dept)),
// //         })),

// //       removeDepartment: (id) =>
// //         set((state) => ({
// //           departments: state.departments.filter((dept) => dept._id !== id),
// //         })),

// //       updateStudentDepartment: (studentId, departmentId) =>
// //         set((state) => ({
// //           students: state.students.map((student) =>
// //             student._id === studentId ? { ...student, departmentId } : student,
// //           ),
// //         })),

// //       clearError: () => set({ error: null }),
// //     }),
// //     { name: "department-store" },
// //   ),
// // )
