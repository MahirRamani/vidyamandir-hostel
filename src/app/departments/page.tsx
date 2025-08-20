"use client"

import { useEffect, useState } from "react"
import { Plus, Users, Eye, EyeOff, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { StudentPanel } from "@/components/department/student-panel"
import { DepartmentTab } from "@/components/department/department-tab"
import { StudentProfileTile } from "@/components/student/student-profile-tile"
import { DepartmentForm } from "@/components/forms/department-form"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { SuccessDialog } from "@/components/dialogs/success-dialog"
import { useDepartmentStore } from "@/store/department-store"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import MainLayout from "@/components/layout/main-layout"
import type { IDepartment } from "@/types/department"
import type { IStudent } from "@/types/student"
import type { DepartmentFormData } from "@/lib/validations/department"

export default function DepartmentsPage() {
  const {
    departments,
    students,
    isLoading,
    setDepartments,
    setStudents,
    setLoading,
    addDepartment,
    updateDepartment,
    removeDepartment,
    updateStudentDepartment,
  } = useDepartmentStore()

  const [showDepartmentForm, setShowDepartmentForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null)
  const [showStudentPanel, setShowStudentPanel] = useState(false) // Student panel hidden by default
  const [showUnassignedPopup, setShowUnassignedPopup] = useState(false) // Unassigned students popup
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    department: IDepartment | null
  }>({ open: false, department: null })
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [departmentsResponse, studentsResponse] = await Promise.all([
        apiClient.getDepartments(),
        apiClient.getStudents({ limit: 10000 }),
      ])

      if (departmentsResponse.success) {
        const sortedDepartments = (departmentsResponse.data || []).sort((a, b) => a._id.localeCompare(b._id));
        setDepartments(sortedDepartments);
      }

      if (studentsResponse.success && studentsResponse.data) {
        setStudents(studentsResponse.data.students)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentDragStart = (student: IStudent) => {
    // Visual feedback handled in StudentPanel
  }

  const handleStudentDrop = async (student: IStudent, department: IDepartment) => {
    try {
      const response = await apiClient.assignStudentToDepartment(student._id, department._id)

      if (response.success) {
        updateStudentDepartment(student._id, department._id)
        toast.success(`${student.name.firstName} assigned to ${department.name}`)
      } else {
        toast.error(response.error || "Failed to assign student")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign student")
    }
  }

  const handleCreateDepartment = async (data: DepartmentFormData) => {
    try {
      const response = await apiClient.createDepartment(data)

      if (response.success && response.data) {
        addDepartment(response.data)
        setShowDepartmentForm(false)
        setSuccessDialog({
          open: true,
          title: "Department Created",
          description: "The department has been successfully created.",
        })
        toast.success("Department created successfully")
      } else {
        toast.error(response.error ? response.error : "Failed to create department")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create department")
    }
  }

  const handleUpdateDepartment = async (data: DepartmentFormData) => {
    if (!editingDepartment) return

    try {
      const response = await apiClient.updateDepartment(editingDepartment._id, data)

      if (response.success && response.data) {
        updateDepartment(editingDepartment._id, response.data)
        setEditingDepartment(null)
        setSuccessDialog({
          open: true,
          title: "Department Updated",
          description: "The department has been successfully updated.",
        })
        toast.success("Department updated successfully")
      } else {
        toast.error(response.error || "Failed to update department")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update department")
    }
  }

  const handleDeleteDepartment = async () => {
    if (!deleteDialog.department) return

    try {
      const response = await apiClient.deleteDepartment(deleteDialog.department._id)

      if (response.success) {
        // Remove department and update students
        removeDepartment(deleteDialog.department._id)

        // Update students to remove department assignment
        const departmentStudents = students.filter((s) => s.departmentId?.toString() === deleteDialog.department!._id?.toString())
        departmentStudents.forEach((student) => {
          updateStudentDepartment(student._id, null)
        })

        setSuccessDialog({
          open: true,
          title: "Department Deleted",
          description: "The department has been successfully deleted and all students have been released.",
        })
        toast.success("Department deleted successfully")
      } else {
        toast.error(response.error || "Failed to delete department")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete department")
    } finally {
      setDeleteDialog({ open: false, department: null })
    }
  }

  const handleStudentRemove = async (student: IStudent, department: IDepartment) => {
    try {
      const response = await apiClient.removeStudentFromDepartment(department._id, student._id)

      if (response.success) {
        updateStudentDepartment(student._id, null)
        toast.success(`${student.name.firstName} removed from ${department.name}`)
      } else {
        toast.error(response.error || "Failed to remove student")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove student")
    }
  }

  // Calculate student count for each department
  const getDepartmentStudentCount = (departmentId: string) => {
    return students.filter((student) => student.departmentId?.toString() === departmentId).length
  }

  // Get unassigned students count for the toggle button
  const unassignedStudentsCount = students.filter((student) => !student.departmentId).length
  const unassignedStudents = students.filter((student) => !student.departmentId)

  if (isLoading) {
    return (
      <MainLayout title="Departments" subtitle="Loading departments...">
        <div className="flex h-full">
          <div className="w-80 flex-shrink-0 border-r bg-white p-4 space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title="Department Management"
      subtitle="Manage departments and assign students"
      actions={
        <div className="flex items-center gap-2">
          {/* Unassigned Students Popup Button */}
          <Button
            variant="outline"
            onClick={() => setShowUnassignedPopup(true)}
            className="relative"
            disabled={unassignedStudentsCount === 0}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Unassigned ({unassignedStudentsCount})
            {unassignedStudentsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unassignedStudentsCount}
              </span>
            )}
          </Button>

          {/* Toggle Student Panel Button */}
          <Button
            variant={showStudentPanel ? "default" : "outline"}
            onClick={() => setShowStudentPanel(!showStudentPanel)}
            className="relative"
          >
            {showStudentPanel ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Students
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Show Students
                {unassignedStudentsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unassignedStudentsCount}
                  </span>
                )}
              </>
            )}
          </Button>
          
          {/* Add Department Button */}
          <Button onClick={() => setShowDepartmentForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      }
    >
      <div className="flex h-full overflow-hidden">
        {/* Student Panel - Conditionally rendered based on showStudentPanel state */}
        {showStudentPanel && (
          <div className="flex-shrink-0 relative animate-in slide-in-from-left duration-300">
            <StudentPanel onStudentDragStart={handleStudentDragStart} />
          </div>
        )}

        {/* Department Tabs - Takes remaining space */}
        <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
          {departments.length > 0 ? (
            <Tabs defaultValue={departments[0]._id} className="flex flex-col h-full">
              {/* Tabs Header with wrapping tabs */}
              <div className="border-b bg-white px-2 py-2 flex-shrink-0">
                <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-1 justify-start">
                  {departments.map((department) => (
                    <TabsTrigger
                      key={department._id}
                      value={department._id}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm border data-[state=active]:border-border data-[state=inactive]:border-transparent"
                    >
                      {department.name} ({getDepartmentStudentCount(department._id)})
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Tabs Content - Scrollable content area */}
              <div className="flex-1 relative overflow-hidden">
                {departments.map((department) => (
                  <TabsContent
                    key={department._id}
                    value={department._id}
                    className="h-full m-0 data-[state=active]:flex data-[state=inactive]:hidden"
                  >
                    <div className="w-full h-full overflow-y-auto">
                      <DepartmentTab
                        department={department as IDepartment}
                        onEdit={setEditingDepartment}
                        onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
                        onStudentDrop={handleStudentDrop}
                        onStudentRemove={handleStudentRemove}
                      />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No Departments Found</h3>
                <p className="text-muted-foreground mb-4">Create your first department to get started</p>
                <Button onClick={() => setShowDepartmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unassigned Students Popup */}
      <Dialog open={showUnassignedPopup} onOpenChange={setShowUnassignedPopup}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen m-0 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Unassigned Students ({unassignedStudentsCount})
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 h-full">
            {unassignedStudents.length > 0 ? (
              <div className="w-full  h-[calc(100vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-4">
                  {unassignedStudents.map((student) => (
                    <StudentProfileTile
                      key={student._id}
                      student={student}
                      departments={departments}
                      className="hover:shadow-md transition-shadow"
                      showDepartment={false}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <p className="text-lg font-medium text-gray-800 mb-2">All Students Assigned!</p>
                <p className="text-muted-foreground">Every student has been successfully assigned to a department.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Department Form Dialog */}
      <Dialog
        open={showDepartmentForm || !!editingDepartment}
        onOpenChange={() => {
          setShowDepartmentForm(false)
          setEditingDepartment(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
          </DialogHeader>
          <DepartmentForm
            initialData={editingDepartment || undefined}
            students={students}
            onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
            onCancel={() => {
              setShowDepartmentForm(false)
              setEditingDepartment(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, department: null })}
        title="Delete Department"
        description={`Are you sure you want to delete ${deleteDialog.department?.name}? This will also release all ${getDepartmentStudentCount(deleteDialog.department?._id || "")} students from this department. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteDepartment}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialog.open}
        onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
        title={successDialog.title}
        description={successDialog.description}
      />
    </MainLayout>
  )
}





// "use client"

// import { useEffect, useState } from "react"
// import { Plus, Users, Eye, EyeOff } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Skeleton } from "@/components/ui/skeleton"
// import { StudentPanel } from "@/components/department/student-panel"
// import { DepartmentTab } from "@/components/department/department-tab"
// import { DepartmentForm } from "@/components/forms/department-form"
// import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
// import { SuccessDialog } from "@/components/dialogs/success-dialog"
// import { useDepartmentStore } from "@/store/department-store"
// import { apiClient } from "@/lib/api-client"
// import { toast } from "sonner"
// import MainLayout from "@/components/layout/main-layout"
// import type { IDepartment } from "@/types/department"
// import type { IStudent } from "@/types/student"
// import type { DepartmentFormData } from "@/lib/validations/department"

// export default function DepartmentsPage() {
//   const {
//     departments,
//     students,
//     isLoading,
//     setDepartments,
//     setStudents,
//     setLoading,
//     addDepartment,
//     updateDepartment,
//     removeDepartment,
//     updateStudentDepartment,
//   } = useDepartmentStore()

//   const [showDepartmentForm, setShowDepartmentForm] = useState(false)
//   const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null)
//   const [showStudentPanel, setShowStudentPanel] = useState(false) // Student panel hidden by default
//   const [deleteDialog, setDeleteDialog] = useState<{
//     open: boolean
//     department: IDepartment | null
//   }>({ open: false, department: null })
//   const [successDialog, setSuccessDialog] = useState<{
//     open: boolean
//     title: string
//     description: string
//   }>({ open: false, title: "", description: "" })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const [departmentsResponse, studentsResponse] = await Promise.all([
//         apiClient.getDepartments(),
//         apiClient.getStudents({ limit: 10000 }),
//       ])

//       if (departmentsResponse.success) {
//         const sortedDepartments = (departmentsResponse.data || []).sort((a, b) => a._id.localeCompare(b._id));
//         setDepartments(sortedDepartments);
//       }

//       if (studentsResponse.success && studentsResponse.data) {
//         setStudents(studentsResponse.data.students)
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to fetch data")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStudentDragStart = (student: IStudent) => {
//     // Visual feedback handled in StudentPanel
//   }

//   const handleStudentDrop = async (student: IStudent, department: IDepartment) => {
//     try {
//       const response = await apiClient.assignStudentToDepartment(student._id, department._id)

//       if (response.success) {
//         updateStudentDepartment(student._id, department._id)
//         toast.success(`${student.name.firstName} assigned to ${department.name}`)
//       } else {
//         toast.error(response.error || "Failed to assign student")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to assign student")
//     }
//   }

//   const handleCreateDepartment = async (data: DepartmentFormData) => {
//     try {
//       const response = await apiClient.createDepartment(data)

//       if (response.success && response.data) {
//         addDepartment(response.data)
//         setShowDepartmentForm(false)
//         setSuccessDialog({
//           open: true,
//           title: "Department Created",
//           description: "The department has been successfully created.",
//         })
//         toast.success("Department created successfully")
//       } else {
//         toast.error(response.error ? response.error : "Failed to create department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to create department")
//     }
//   }

//   const handleUpdateDepartment = async (data: DepartmentFormData) => {
//     if (!editingDepartment) return

//     try {
//       const response = await apiClient.updateDepartment(editingDepartment._id, data)

//       if (response.success && response.data) {
//         updateDepartment(editingDepartment._id, response.data)
//         setEditingDepartment(null)
//         setSuccessDialog({
//           open: true,
//           title: "Department Updated",
//           description: "The department has been successfully updated.",
//         })
//         toast.success("Department updated successfully")
//       } else {
//         toast.error(response.error || "Failed to update department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to update department")
//     }
//   }

//   const handleDeleteDepartment = async () => {
//     if (!deleteDialog.department) return

//     try {
//       const response = await apiClient.deleteDepartment(deleteDialog.department._id)

//       if (response.success) {
//         // Remove department and update students
//         removeDepartment(deleteDialog.department._id)

//         // Update students to remove department assignment
//         const departmentStudents = students.filter((s) => s.departmentId?.toString() === deleteDialog.department!._id?.toString())
//         departmentStudents.forEach((student) => {
//           updateStudentDepartment(student._id, null)
//         })

//         setSuccessDialog({
//           open: true,
//           title: "Department Deleted",
//           description: "The department has been successfully deleted and all students have been released.",
//         })
//         toast.success("Department deleted successfully")
//       } else {
//         toast.error(response.error || "Failed to delete department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to delete department")
//     } finally {
//       setDeleteDialog({ open: false, department: null })
//     }
//   }

//   const handleStudentRemove = async (student: IStudent, department: IDepartment) => {
//     try {
//       const response = await apiClient.removeStudentFromDepartment(department._id, student._id)

//       if (response.success) {
//         updateStudentDepartment(student._id, null)
//         toast.success(`${student.name.firstName} removed from ${department.name}`)
//       } else {
//         toast.error(response.error || "Failed to remove student")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to remove student")
//     }
//   }

//   // Calculate student count for each department
//   const getDepartmentStudentCount = (departmentId: string) => {
//     return students.filter((student) => student.departmentId?.toString() === departmentId).length
//   }

//   // Get unassigned students count for the toggle button
//   const unassignedStudentsCount = students.filter((student) => !student.departmentId).length

//   if (isLoading) {
//     return (
//       <MainLayout title="Departments" subtitle="Loading departments...">
//         <div className="flex h-full">
//           <div className="w-80 flex-shrink-0 border-r bg-white p-4 space-y-4">
//             <Skeleton className="h-8 w-32" />
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-10 w-full" />
//             {Array.from({ length: 4 }).map((_, i) => (
//               <Skeleton key={i} className="h-32 w-full" />
//             ))}
//           </div>
//           <div className="flex-1 p-6">
//             <Skeleton className="h-8 w-48 mb-4" />
//             <Skeleton className="h-96 w-full" />
//           </div>
//         </div>
//       </MainLayout>
//     )
//   }

//   return (
//     <MainLayout
//       title="Department Management"
//       subtitle="Manage departments and assign students"
//       actions={
//         <div className="flex items-center gap-2">
//           {/* Toggle Student Panel Button */}
//           <Button
//             variant={showStudentPanel ? "default" : "outline"}
//             onClick={() => setShowStudentPanel(!showStudentPanel)}
//             className="relative"
//           >
//             {showStudentPanel ? (
//               <>
//                 <EyeOff className="h-4 w-4 mr-2" />
//                 Hide Students
//               </>
//             ) : (
//               <>
//                 <Users className="h-4 w-4 mr-2" />
//                 Show Students
//                 {unassignedStudentsCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {unassignedStudentsCount}
//                   </span>
//                 )}
//               </>
//             )}
//           </Button>
          
//           {/* Add Department Button */}
//           <Button onClick={() => setShowDepartmentForm(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Department
//           </Button>
//         </div>
//       }
//     >
//       <div className="flex h-full overflow-hidden">
//         {/* Student Panel - Conditionally rendered based on showStudentPanel state */}
//         {showStudentPanel && (
//           <div className="flex-shrink-0 relative animate-in slide-in-from-left duration-300">
//             <StudentPanel onStudentDragStart={handleStudentDragStart} />
//           </div>
//         )}

//         {/* Department Tabs - Takes remaining space */}
//         <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
//           {departments.length > 0 ? (
//             <Tabs defaultValue={departments[0]._id} className="flex flex-col h-full">
//               {/* Tabs Header with wrapping tabs */}
//               <div className="border-b bg-white px-2 py-2 flex-shrink-0">
//                 <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-1 justify-start">
//                   {departments.map((department) => (
//                     <TabsTrigger
//                       key={department._id}
//                       value={department._id}
//                       className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm border data-[state=active]:border-border data-[state=inactive]:border-transparent"
//                     >
//                       {department.name} ({getDepartmentStudentCount(department._id)})
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>
//               </div>

//               {/* Tabs Content - Scrollable content area */}
//               <div className="flex-1 relative overflow-hidden">
//                 {departments.map((department) => (
//                   <TabsContent
//                     key={department._id}
//                     value={department._id}
//                     className="h-full m-0 data-[state=active]:flex data-[state=inactive]:hidden"
//                   >
//                     <div className="w-full h-full overflow-y-auto">
//                       <DepartmentTab
//                         department={department as IDepartment}
//                         onEdit={setEditingDepartment}
//                         onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
//                         onStudentDrop={handleStudentDrop}
//                         onStudentRemove={handleStudentRemove}
//                       />
//                     </div>
//                   </TabsContent>
//                 ))}
//               </div>
//             </Tabs>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <h3 className="text-lg font-semibold mb-2">No Departments Found</h3>
//                 <p className="text-muted-foreground mb-4">Create your first department to get started</p>
//                 <Button onClick={() => setShowDepartmentForm(true)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Department
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Department Form Dialog */}
//       <Dialog
//         open={showDepartmentForm || !!editingDepartment}
//         onOpenChange={() => {
//           setShowDepartmentForm(false)
//           setEditingDepartment(null)
//         }}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
//           </DialogHeader>
//           <DepartmentForm
//             initialData={editingDepartment || undefined}
//             students={students}
//             onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
//             onCancel={() => {
//               setShowDepartmentForm(false)
//               setEditingDepartment(null)
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={deleteDialog.open}
//         onOpenChange={(open) => setDeleteDialog({ open, department: null })}
//         title="Delete Department"
//         description={`Are you sure you want to delete ${deleteDialog.department?.name}? This will also release all ${getDepartmentStudentCount(deleteDialog.department?._id || "")} students from this department. This action cannot be undone.`}
//         confirmText="Delete"
//         cancelText="Cancel"
//         variant="destructive"
//         onConfirm={handleDeleteDepartment}
//       />

//       {/* Success Dialog */}
//       <SuccessDialog
//         open={successDialog.open}
//         onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
//         title={successDialog.title}
//         description={successDialog.description}
//       />
//     </MainLayout>
//   )
// }









// "use client"

// import { useEffect, useState } from "react"
// import { Plus } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Skeleton } from "@/components/ui/skeleton"
// import { StudentPanel } from "@/components/department/student-panel"
// import { DepartmentTab } from "@/components/department/department-tab"
// import { DepartmentForm } from "@/components/forms/department-form"
// import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
// import { SuccessDialog } from "@/components/dialogs/success-dialog"
// import { useDepartmentStore } from "@/store/department-store"
// import { apiClient } from "@/lib/api-client"
// import { toast } from "sonner"
// import MainLayout from "@/components/layout/main-layout"
// import type { IDepartment } from "@/types/department"
// import type { IStudent } from "@/types/student"
// import type { DepartmentFormData } from "@/lib/validations/department"

// export default function DepartmentsPage() {
//   const {
//     departments,
//     students,
//     isLoading,
//     setDepartments,
//     setStudents,
//     setLoading,
//     addDepartment,
//     updateDepartment,
//     removeDepartment,
//     updateStudentDepartment,
//   } = useDepartmentStore()

//   const [showDepartmentForm, setShowDepartmentForm] = useState(false)
//   const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null)
//   const [deleteDialog, setDeleteDialog] = useState<{
//     open: boolean
//     department: IDepartment | null
//   }>({ open: false, department: null })
//   const [successDialog, setSuccessDialog] = useState<{
//     open: boolean
//     title: string
//     description: string
//   }>({ open: false, title: "", description: "" })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const [departmentsResponse, studentsResponse] = await Promise.all([
//         apiClient.getDepartments(),
//         apiClient.getStudents({ limit: 10000 }),
//       ])

//       // if (departmentsResponse.success) {
//       //   setDepartments(departmentsResponse.data || [])
//       // }

//       if (departmentsResponse.success) {
//         const sortedDepartments = (departmentsResponse.data || []).sort((a, b) => a._id.localeCompare(b._id));
//         setDepartments(sortedDepartments);
//       }

//       if (studentsResponse.success && studentsResponse.data) {
//         setStudents(studentsResponse.data.students)
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to fetch data")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStudentDragStart = (student: IStudent) => {
//     // Visual feedback handled in StudentPanel
//   }

//   const handleStudentDrop = async (student: IStudent, department: IDepartment) => {
//     try {
//       const response = await apiClient.assignStudentToDepartment(student._id, department._id)

//       if (response.success) {
//         updateStudentDepartment(student._id, department._id)
//         toast.success(`${student.name.firstName} assigned to ${department.name}`)
//       } else {
//         toast.error(response.error || "Failed to assign student")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to assign student")
//     }
//   }

//   const handleCreateDepartment = async (data: DepartmentFormData) => {
//     try {
//       const response = await apiClient.createDepartment(data)

//       if (response.success && response.data) {
//         addDepartment(response.data)
//         setShowDepartmentForm(false)
//         setSuccessDialog({
//           open: true,
//           title: "Department Created",
//           description: "The department has been successfully created.",
//         })
//         toast.success("Department created successfully")
//       } else {
//         toast.error(response.error ? response.error : "Failed to create department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to create department")
//     }
//   }

//   const handleUpdateDepartment = async (data: DepartmentFormData) => {
//     if (!editingDepartment) return

//     try {
//       const response = await apiClient.updateDepartment(editingDepartment._id, data)

//       if (response.success && response.data) {
//         updateDepartment(editingDepartment._id, response.data)
//         setEditingDepartment(null)
//         setSuccessDialog({
//           open: true,
//           title: "Department Updated",
//           description: "The department has been successfully updated.",
//         })
//         toast.success("Department updated successfully")
//       } else {
//         toast.error(response.error || "Failed to update department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to update department")
//     }
//   }

//   const handleDeleteDepartment = async () => {
//     if (!deleteDialog.department) return

//     try {
//       const response = await apiClient.deleteDepartment(deleteDialog.department._id)

//       if (response.success) {
//         // Remove department and update students
//         removeDepartment(deleteDialog.department._id)

//         // Update students to remove department assignment
//         const departmentStudents = students.filter((s) => s.departmentId?.toString() === deleteDialog.department!._id?.toString())
//         departmentStudents.forEach((student) => {
//           updateStudentDepartment(student._id, null)
//         })

//         setSuccessDialog({
//           open: true,
//           title: "Department Deleted",
//           description: "The department has been successfully deleted and all students have been released.",
//         })
//         toast.success("Department deleted successfully")
//       } else {
//         toast.error(response.error || "Failed to delete department")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to delete department")
//     } finally {
//       setDeleteDialog({ open: false, department: null })
//     }
//   }

//   const handleStudentRemove = async (student: IStudent, department: IDepartment) => {
//     try {
//       const response = await apiClient.removeStudentFromDepartment(department._id, student._id)

//       if (response.success) {
//         updateStudentDepartment(student._id, null)
//         toast.success(`${student.name.firstName} removed from ${department.name}`)
//       } else {
//         toast.error(response.error || "Failed to remove student")
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to remove student")
//     }
//   }

//   // Calculate student count for each department
//   const getDepartmentStudentCount = (departmentId: string) => {
//     return students.filter((student) => student.departmentId?.toString() === departmentId).length
//   }

//   if (isLoading) {
//     return (
//       <MainLayout title="Departments" subtitle="Loading departments...">
//         <div className="flex h-full">
//           <div className="w-80 flex-shrink-0 border-r bg-white p-4 space-y-4">
//             <Skeleton className="h-8 w-32" />
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-10 w-full" />
//             {Array.from({ length: 4 }).map((_, i) => (
//               <Skeleton key={i} className="h-32 w-full" />
//             ))}
//           </div>
//           <div className="flex-1 p-6">
//             <Skeleton className="h-8 w-48 mb-4" />
//             <Skeleton className="h-96 w-full" />
//           </div>
//         </div>
//       </MainLayout>
//     )
//   }

//   return (
//     <MainLayout
//       title="Department Management"
//       subtitle="Manage departments and assign students"
//       actions={
//         <Button onClick={() => setShowDepartmentForm(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Department
//         </Button>
//       }
//     >
//       <div className="flex h-full overflow-hidden">
//         {/* Student Panel - Fixed width and position */}
//         <div className="flex-shrink-0 relative">
//           <StudentPanel onStudentDragStart={handleStudentDragStart} />
//         </div>

//         {/* Department Tabs - Takes remaining space */}
//         <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
//           {departments.length > 0 ? (
//             <Tabs defaultValue={departments[0]._id} className="flex flex-col h-full">
//               {/* Tabs Header with wrapping tabs */}
//               <div className="border-b bg-white px-2 py-2 flex-shrink-0">
//                 <TabsList className="h-auto p-0 bg-transparent flex flex-wrap gap-1 justify-start">
//                   {departments.map((department) => (
//                     <TabsTrigger
//                       key={department._id}
//                       value={department._id}
//                       className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm border data-[state=active]:border-border data-[state=inactive]:border-transparent"
//                     >
//                       {department.name} ({getDepartmentStudentCount(department._id)})
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>
//               </div>

//               {/* Tabs Content - Scrollable content area */}
//               <div className="flex-1 relative overflow-hidden">
//                 {departments.map((department) => (
//                   <TabsContent
//                     key={department._id}
//                     value={department._id}
//                     className="h-full m-0 data-[state=active]:flex data-[state=inactive]:hidden"
//                   >
//                     <div className="w-full h-full overflow-y-auto">
//                       <DepartmentTab
//                         department={department as IDepartment}
//                         onEdit={setEditingDepartment}
//                         onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
//                         onStudentDrop={handleStudentDrop}
//                         onStudentRemove={handleStudentRemove}
//                       />
//                     </div>
//                   </TabsContent>
//                 ))}
//               </div>
//             </Tabs>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <h3 className="text-lg font-semibold mb-2">No Departments Found</h3>
//                 <p className="text-muted-foreground mb-4">Create your first department to get started</p>
//                 <Button onClick={() => setShowDepartmentForm(true)}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Department
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Department Form Dialog */}
//       <Dialog
//         open={showDepartmentForm || !!editingDepartment}
//         onOpenChange={() => {
//           setShowDepartmentForm(false)
//           setEditingDepartment(null)
//         }}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
//           </DialogHeader>
//           <DepartmentForm
//             initialData={editingDepartment || undefined}
//             students={students}
//             onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
//             onCancel={() => {
//               setShowDepartmentForm(false)
//               setEditingDepartment(null)
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={deleteDialog.open}
//         onOpenChange={(open) => setDeleteDialog({ open, department: null })}
//         title="Delete Department"
//         description={`Are you sure you want to delete ${deleteDialog.department?.name}? This will also release all ${getDepartmentStudentCount(deleteDialog.department?._id || "")} students from this department. This action cannot be undone.`}
//         confirmText="Delete"
//         cancelText="Cancel"
//         variant="destructive"
//         onConfirm={handleDeleteDepartment}
//       />

//       {/* Success Dialog */}
//       <SuccessDialog
//         open={successDialog.open}
//         onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
//         title={successDialog.title}
//         description={successDialog.description}
//       />
//     </MainLayout>
//   )
// }



// // "use client"

// // import { useEffect, useState } from "react"
// // import { Plus } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // import { Skeleton } from "@/components/ui/skeleton"
// // import { StudentPanel } from "@/components/department/student-panel"
// // import { DepartmentTab } from "@/components/department/department-tab"
// // import { DepartmentForm } from "@/components/forms/department-form"
// // import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
// // import { SuccessDialog } from "@/components/dialogs/success-dialog"
// // import { useDepartmentStore } from "@/store/department-store"
// // import { apiClient } from "@/lib/api-client"
// // import { toast } from "sonner"
// // import MainLayout from "@/components/layout/main-layout"
// // import type { IDepartment } from "@/types/department"
// // import type { IStudent } from "@/types/student"
// // import type { DepartmentFormData } from "@/lib/validations/department"

// // export default function DepartmentsPage() {
// //   const {
// //     departments,
// //     students,
// //     isLoading,
// //     setDepartments,
// //     setStudents,
// //     setLoading,
// //     addDepartment,
// //     updateDepartment,
// //     removeDepartment,
// //     updateStudentDepartment,
// //   } = useDepartmentStore()

// //   const [showDepartmentForm, setShowDepartmentForm] = useState(false)
// //   const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null)
// //   const [deleteDialog, setDeleteDialog] = useState<{
// //     open: boolean
// //     department: IDepartment | null
// //   }>({ open: false, department: null })
// //   const [successDialog, setSuccessDialog] = useState<{
// //     open: boolean
// //     title: string
// //     description: string
// //   }>({ open: false, title: "", description: "" })

// //   useEffect(() => {
// //     fetchData()
// //   }, [])

// //   const fetchData = async () => {
// //     setLoading(true)
// //     try {
// //       const [departmentsResponse, studentsResponse] = await Promise.all([
// //         apiClient.getDepartments(),
// //         apiClient.getStudents({ limit: 10000 }),
// //       ])

// //       if (departmentsResponse.success) {
// //         setDepartments(departmentsResponse.data || [])
// //       }

// //       if (studentsResponse.success && studentsResponse.data) {
// //         setStudents(studentsResponse.data.students)
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to fetch data")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleStudentDragStart = (student: IStudent) => {
// //     // Visual feedback handled in StudentPanel
// //   }

// //   const handleStudentDrop = async (student: IStudent, department: IDepartment) => {
// //     try {
// //       const response = await apiClient.assignStudentToDepartment(student._id, department._id)

// //       if (response.success) {
// //         updateStudentDepartment(student._id, department._id)
// //         toast.success(`${student.name.firstName} assigned to ${department.name}`)
// //       } else {
// //         toast.error(response.error || "Failed to assign student")
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to assign student")
// //     }
// //   }

// //   const handleCreateDepartment = async (data: DepartmentFormData) => {
// //     try {
// //       const response = await apiClient.createDepartment(data)

// //       if (response.success && response.data) {
// //         addDepartment(response.data)
// //         setShowDepartmentForm(false)
// //         setSuccessDialog({
// //           open: true,
// //           title: "Department Created",
// //           description: "The department has been successfully created.",
// //         })
// //         toast.success("Department created successfully")
// //       } else {
// //         toast.error(response.error ? response.error : "Failed to create department")
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to create department")
// //     }
// //   }

// //   const handleUpdateDepartment = async (data: DepartmentFormData) => {
// //     if (!editingDepartment) return

// //     try {
// //       const response = await apiClient.updateDepartment(editingDepartment._id, data)

// //       if (response.success && response.data) {
// //         updateDepartment(editingDepartment._id, response.data)
// //         setEditingDepartment(null)
// //         setSuccessDialog({
// //           open: true,
// //           title: "Department Updated",
// //           description: "The department has been successfully updated.",
// //         })
// //         toast.success("Department updated successfully")
// //       } else {
// //         toast.error(response.error || "Failed to update department")
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to update department")
// //     }
// //   }

// //   const handleDeleteDepartment = async () => {
// //     if (!deleteDialog.department) return

// //     try {
// //       const response = await apiClient.deleteDepartment(deleteDialog.department._id)

// //       if (response.success) {
// //         // Remove department and update students
// //         removeDepartment(deleteDialog.department._id)

// //         // Update students to remove department assignment
// //         const departmentStudents = students.filter((s) => s.departmentId?.toString() === deleteDialog.department!._id?.toString())
// //         departmentStudents.forEach((student) => {
// //           updateStudentDepartment(student._id, null)
// //         })

// //         setSuccessDialog({
// //           open: true,
// //           title: "Department Deleted",
// //           description: "The department has been successfully deleted and all students have been released.",
// //         })
// //         toast.success("Department deleted successfully")
// //       } else {
// //         toast.error(response.error || "Failed to delete department")
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to delete department")
// //     } finally {
// //       setDeleteDialog({ open: false, department: null })
// //     }
// //   }

// //   const handleStudentRemove = async (student: IStudent, department: IDepartment) => {
// //     try {
// //       const response = await apiClient.removeStudentFromDepartment(department._id, student._id)

// //       if (response.success) {
// //         updateStudentDepartment(student._id, null)
// //         toast.success(`${student.name.firstName} removed from ${department.name}`)
// //       } else {
// //         toast.error(response.error || "Failed to remove student")
// //       }
// //     } catch (error) {
// //       toast.error(error instanceof Error ? error.message : "Failed to remove student")
// //     }
// //   }

// //   // Calculate student count for each department
// //   const getDepartmentStudentCount = (departmentId: string) => {
// //     return students.filter((student) => student.departmentId?.toString() === departmentId).length
// //   }

// //   if (isLoading) {
// //     return (
// //       <MainLayout title="Departments" subtitle="Loading departments...">
// //         <div className="flex h-full">
// //           <div className="w-80 flex-shrink-0 border-r bg-white p-4 space-y-4">
// //             <Skeleton className="h-8 w-32" />
// //             <Skeleton className="h-10 w-full" />
// //             <Skeleton className="h-10 w-full" />
// //             {Array.from({ length: 4 }).map((_, i) => (
// //               <Skeleton key={i} className="h-32 w-full" />
// //             ))}
// //           </div>
// //           <div className="flex-1 p-6">
// //             <Skeleton className="h-8 w-48 mb-4" />
// //             <Skeleton className="h-96 w-full" />
// //           </div>
// //         </div>
// //       </MainLayout>
// //     )
// //   }

// //   return (
// //     <MainLayout
// //       title="Department Management"
// //       subtitle="Manage departments and assign students"
// //       actions={
// //         <Button onClick={() => setShowDepartmentForm(true)}>
// //           <Plus className="h-4 w-4 mr-2" />
// //           Add Department
// //         </Button>
// //       }
// //     >
// //       <div className="flex h-full overflow-hidden">
// //         {/* Student Panel - Fixed width and position */}
// //         <div className="w-80 flex-shrink-0 relative">
// //           <StudentPanel onStudentDragStart={handleStudentDragStart} />
// //         </div>

// //         {/* Department Tabs - Takes remaining space */}
// //         <div className="flex-1 bg-gray-50 flex flex-col min-w-0">
// //           {departments.length > 0 ? (
// //             <Tabs defaultValue={departments[0]._id} className="flex flex-col h-full">
// //               {/* Tabs Header with scrollable tabs */}
// //               <div className="border-b bg-white px-2 py-1 flex-shrink-0">
// //                 <div className="overflow-x-auto overflow-y-hidden">
// //                   <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
// //                     {departments.map((department) => (
// //                       <TabsTrigger
// //                         key={department._id}
// //                         value={department._id}
// //                         className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-shrink-0"
// //                       >
// //                         {department.name} ({getDepartmentStudentCount(department._id)})
// //                       </TabsTrigger>
// //                     ))}
// //                   </TabsList>
// //                 </div>
// //               </div>

// //               {/* Tabs Content - Scrollable content area */}
// //               <div className="flex-1 relative overflow-hidden">
// //                 {departments.map((department) => (
// //                   <TabsContent
// //                     key={department._id}
// //                     value={department._id}
// //                     className="h-full m-0 data-[state=active]:flex data-[state=inactive]:hidden"
// //                   >
// //                     <div className="w-full h-full overflow-y-auto">
// //                       <DepartmentTab
// //                         department={department as IDepartment}
// //                         onEdit={setEditingDepartment}
// //                         onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
// //                         onStudentDrop={handleStudentDrop}
// //                         onStudentRemove={handleStudentRemove}
// //                       />
// //                     </div>
// //                   </TabsContent>
// //                 ))}
// //               </div>
// //             </Tabs>
// //           ) : (
// //             <div className="flex items-center justify-center h-full">
// //               <div className="text-center">
// //                 <h3 className="text-lg font-semibold mb-2">No Departments Found</h3>
// //                 <p className="text-muted-foreground mb-4">Create your first department to get started</p>
// //                 <Button onClick={() => setShowDepartmentForm(true)}>
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Add Department
// //                 </Button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Department Form Dialog */}
// //       <Dialog
// //         open={showDepartmentForm || !!editingDepartment}
// //         onOpenChange={() => {
// //           setShowDepartmentForm(false)
// //           setEditingDepartment(null)
// //         }}
// //       >
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
// //           </DialogHeader>
// //           <DepartmentForm
// //             initialData={editingDepartment || undefined}
// //             students={students}
// //             onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
// //             onCancel={() => {
// //               setShowDepartmentForm(false)
// //               setEditingDepartment(null)
// //             }}
// //           />
// //         </DialogContent>
// //       </Dialog>

// //       {/* Delete Confirmation Dialog */}
// //       <ConfirmationDialog
// //         open={deleteDialog.open}
// //         onOpenChange={(open) => setDeleteDialog({ open, department: null })}
// //         title="Delete Department"
// //         description={`Are you sure you want to delete ${deleteDialog.department?.name}? This will also release all ${getDepartmentStudentCount(deleteDialog.department?._id || "")} students from this department. This action cannot be undone.`}
// //         confirmText="Delete"
// //         cancelText="Cancel"
// //         variant="destructive"
// //         onConfirm={handleDeleteDepartment}
// //       />

// //       {/* Success Dialog */}
// //       <SuccessDialog
// //         open={successDialog.open}
// //         onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
// //         title={successDialog.title}
// //         description={successDialog.description}
// //       />
// //     </MainLayout>
// //   )
// // }

// // // "use client"

// // // import { useEffect, useState } from "react"
// // // import { Plus } from "lucide-react"
// // // import { Button } from "@/components/ui/button"
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // import { Skeleton } from "@/components/ui/skeleton"
// // // import { StudentPanel } from "@/components/department/student-panel"
// // // import { DepartmentTab } from "@/components/department/department-tab"
// // // import { DepartmentForm } from "@/components/forms/department-form"
// // // import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
// // // import { SuccessDialog } from "@/components/dialogs/success-dialog"
// // // import { useDepartmentStore } from "@/store/department-store"
// // // import { apiClient } from "@/lib/api-client"
// // // import { toast } from "sonner"
// // // import MainLayout from "@/components/layout/main-layout"
// // // import type { IDepartment } from "@/types/department"
// // // import type { IStudent } from "@/types/student"
// // // import type { DepartmentFormData } from "@/lib/validations/department"

// // // export default function DepartmentsPage() {
// // //   const {
// // //     departments,
// // //     students,
// // //     isLoading,
// // //     setDepartments,
// // //     setStudents,
// // //     setLoading,
// // //     addDepartment,
// // //     updateDepartment,
// // //     removeDepartment,
// // //     updateStudentDepartment,
// // //   } = useDepartmentStore()

// // //   const [showDepartmentForm, setShowDepartmentForm] = useState(false)
// // //   const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null)
// // //   const [deleteDialog, setDeleteDialog] = useState<{
// // //     open: boolean
// // //     department: IDepartment | null
// // //   }>({ open: false, department: null })
// // //   const [successDialog, setSuccessDialog] = useState<{
// // //     open: boolean
// // //     title: string
// // //     description: string
// // //   }>({ open: false, title: "", description: "" })

// // //   useEffect(() => {
// // //     fetchData()
// // //   }, [])

// // //   const fetchData = async () => {
// // //     setLoading(true)
// // //     try {
// // //       const [departmentsResponse, studentsResponse] = await Promise.all([
// // //         apiClient.getDepartments(),
// // //         apiClient.getStudents({ limit: 10000 }),
// // //       ])

// // //       if (departmentsResponse.success) {
// // //         setDepartments(departmentsResponse.data || [])
// // //       }

// // //       if (studentsResponse.success && studentsResponse.data) {
// // //         setStudents(studentsResponse.data.students)
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to fetch data")
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const handleStudentDragStart = (student: IStudent) => {
// // //     // Visual feedback handled in StudentPanel
// // //   }

// // //   const handleStudentDrop = async (student: IStudent, department: IDepartment) => {
// // //     try {
// // //       const response = await apiClient.assignStudentToDepartment(student._id, department._id)

// // //       if (response.success) {
// // //         updateStudentDepartment(student._id, department._id)
// // //         toast.success(`${student.name.firstName} assigned to ${department.name}`)
// // //       } else {
// // //         toast.error(response.error || "Failed to assign student")
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to assign student")
// // //     }
// // //   }

// // //   const handleCreateDepartment = async (data: DepartmentFormData) => {
// // //     try {
// // //       const response = await apiClient.createDepartment(data)

// // //       if (response.success && response.data) {
// // //         addDepartment(response.data)
// // //         setShowDepartmentForm(false)
// // //         setSuccessDialog({
// // //           open: true,
// // //           title: "Department Created",
// // //           description: "The department has been successfully created.",
// // //         })
// // //         toast.success("Department created successfully")
// // //       } else {
// // //         toast.error(response.error ? response.error : "Failed to create department")
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to create department")
// // //     }
// // //   }

// // //   const handleUpdateDepartment = async (data: DepartmentFormData) => {
// // //     if (!editingDepartment) return

// // //     try {
// // //       const response = await apiClient.updateDepartment(editingDepartment._id, data)

// // //       if (response.success && response.data) {
// // //         updateDepartment(editingDepartment._id, response.data)
// // //         setEditingDepartment(null)
// // //         setSuccessDialog({
// // //           open: true,
// // //           title: "Department Updated",
// // //           description: "The department has been successfully updated.",
// // //         })
// // //         toast.success("Department updated successfully")
// // //       } else {
// // //         toast.error(response.error || "Failed to update department")
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to update department")
// // //     }
// // //   }

// // //   const handleDeleteDepartment = async () => {
// // //     if (!deleteDialog.department) return

// // //     try {
// // //       const response = await apiClient.deleteDepartment(deleteDialog.department._id)

// // //       if (response.success) {
// // //         // Remove department and update students
// // //         removeDepartment(deleteDialog.department._id)

// // //         // Update students to remove department assignment
// // //         const departmentStudents = students.filter((s) => s.departmentId?.toString() === deleteDialog.department!._id?.toString())
// // //         departmentStudents.forEach((student) => {
// // //           updateStudentDepartment(student._id, null)
// // //         })

// // //         setSuccessDialog({
// // //           open: true,
// // //           title: "Department Deleted",
// // //           description: "The department has been successfully deleted and all students have been released.",
// // //         })
// // //         toast.success("Department deleted successfully")
// // //       } else {
// // //         toast.error(response.error || "Failed to delete department")
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to delete department")
// // //     } finally {
// // //       setDeleteDialog({ open: false, department: null })
// // //     }
// // //   }


// // //   const handleStudentRemove = async (student: IStudent, department: IDepartment) => {
// // //     try {
// // //       const response = await apiClient.removeStudentFromDepartment(department._id, student._id)

// // //       if (response.success) {
// // //         updateStudentDepartment(student._id, null)
// // //         toast.success(`${student.name.firstName} removed from ${department.name}`)
// // //       } else {
// // //         toast.error(response.error || "Failed to remove student")
// // //       }
// // //     } catch (error) {
// // //       toast.error(error instanceof Error ? error.message : "Failed to remove student")
// // //     }
// // //   }


// // //   // Calculate student count for each department
// // //   const getDepartmentStudentCount = (departmentId: string) => {
// // //     return students.filter((student) => student.departmentId?.toString() === departmentId).length
// // //   }

// // //   if (isLoading) {
// // //     return (
// // //       <MainLayout title="Departments" subtitle="Loading departments...">
// // //         <div className="flex h-full">
// // //           <div className="w-80 border-r bg-white p-4 space-y-4">
// // //             <Skeleton className="h-8 w-32" />
// // //             <Skeleton className="h-10 w-full" />
// // //             <Skeleton className="h-10 w-full" />
// // //             {Array.from({ length: 4 }).map((_, i) => (
// // //               <Skeleton key={i} className="h-32 w-full" />
// // //             ))}
// // //           </div>
// // //           <div className="flex-1 p-6">
// // //             <Skeleton className="h-8 w-48 mb-4" />
// // //             <Skeleton className="h-96 w-full" />
// // //           </div>
// // //         </div>
// // //       </MainLayout>
// // //     )
// // //   }

// // //   return (
// // //     <MainLayout
// // //       title="Department Management"
// // //       subtitle="Manage departments and assign students"
// // //       actions={
// // //         <Button onClick={() => setShowDepartmentForm(true)}>
// // //           <Plus className="h-4 w-4 mr-2" />
// // //           Add Department
// // //         </Button>
// // //       }
// // //     >
// // //       <div className="flex h-full">
// // //         {/* Student Panel */}
// // //         <StudentPanel onStudentDragStart={handleStudentDragStart} />

// // //         {/* Department Tabs */}
// // //         <div className="flex-1 bg-gray-50">
// // //           {departments.length > 0 ? (
// // //             <Tabs defaultValue={departments[0]._id} className="h-full">
// // //               <div className="border-b bg-white px-2 py-1">
// // //                 <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto">
// // //                   {departments.map((department) => (
// // //                     <TabsTrigger
// // //                       key={department._id}
// // //                       value={department._id}
// // //                       className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
// // //                     >
// // //                       {department.name} ({getDepartmentStudentCount(department._id)})
// // //                     </TabsTrigger>
// // //                   ))}
// // //                 </TabsList>
// // //               </div>

// // //               {departments.map((department) => (
// // //                 <TabsContent key={department._id} value={department._id} className="h-full">
// // //                   {/* <DepartmentTab
// // //                     department={department}
// // //                     onEdit={setEditingDepartment}
// // //                     onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
// // //                     onStudentDrop={handleStudentDrop}
// // //                   /> */}
// // //                   <DepartmentTab
// // //                     department={department as IDepartment}
// // //                     onEdit={setEditingDepartment}
// // //                     onDelete={(dept) => setDeleteDialog({ open: true, department: dept })}
// // //                     onStudentDrop={handleStudentDrop}
// // //                     onStudentRemove={handleStudentRemove}
// // //                   />
// // //                 </TabsContent>
// // //               ))}
// // //             </Tabs>
// // //           ) : (
// // //             <div className="flex items-center justify-center h-full">
// // //               <div className="text-center">
// // //                 <h3 className="text-lg font-semibold mb-2">No Departments Found</h3>
// // //                 <p className="text-muted-foreground mb-4">Create your first department to get started</p>
// // //                 <Button onClick={() => setShowDepartmentForm(true)}>
// // //                   <Plus className="h-4 w-4 mr-2" />
// // //                   Add Department
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Department Form Dialog */}
// // //       <Dialog
// // //         open={showDepartmentForm || !!editingDepartment}
// // //         onOpenChange={() => {
// // //           setShowDepartmentForm(false)
// // //           setEditingDepartment(null)
// // //         }}
// // //       >
// // //         <DialogContent>
// // //           <DialogHeader>
// // //             <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
// // //           </DialogHeader>
// // //           <DepartmentForm
// // //             initialData={editingDepartment || undefined}
// // //             students={students}
// // //             onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
// // //             onCancel={() => {
// // //               setShowDepartmentForm(false)
// // //               setEditingDepartment(null)
// // //             }}
// // //           />
// // //         </DialogContent>
// // //       </Dialog>

// // //       {/* Delete Confirmation Dialog */}
// // //       <ConfirmationDialog
// // //         open={deleteDialog.open}
// // //         onOpenChange={(open) => setDeleteDialog({ open, department: null })}
// // //         title="Delete Department"
// // //         description={`Are you sure you want to delete ${deleteDialog.department?.name}? This will also release all ${getDepartmentStudentCount(deleteDialog.department?._id || "")} students from this department. This action cannot be undone.`}
// // //         confirmText="Delete"
// // //         cancelText="Cancel"
// // //         variant="destructive"
// // //         onConfirm={handleDeleteDepartment}
// // //       />

// // //       {/* Success Dialog */}
// // //       <SuccessDialog
// // //         open={successDialog.open}
// // //         onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
// // //         title={successDialog.title}
// // //         description={successDialog.description}
// // //       />
// // //     </MainLayout>
// // //   )
// // // }
