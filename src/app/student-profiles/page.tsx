"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Search, Filter, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { SuccessDialog } from "@/components/dialogs/success-dialog"
import { useStudentStore } from "@/store/student-store"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layout/main-layout"
import type { IStudent } from "@/types/student"

export default function StudentProfilesPage() {
  const router = useRouter()
  const {
    students,
    isLoading,
    searchQuery,
    statusFilter,
    setStudents,
    setLoading,
    setSearchQuery,
    setStatusFilter,
    removeStudent,
  } = useStudentStore()

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    student: IStudent | null
  }>({ open: false, student: null })

  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    title: string
    description: string
  }>({ open: false, title: "", description: "" })

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const [searchResults, setSearchResults] = useState<IStudent[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Memoize fetchStudents to prevent unnecessary recreations
  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await apiClient.getStudents({
        status: statusFilter,
        page,
        limit: 300,
      })

      // if (response.success && response.data) {
      //   setStudents(response.data.students)
      //   setPagination({
      //     page: response.data.page,
      //     totalPages: response.data.totalPages,
      //     total: response.data.total,
      //   })
      // }

      if (response.success && response.data) {
        const sortedStudents = response.data.students.sort((a, b) => {
          const standardA = Number(a.standard) || 0;
          const standardB = Number(b.standard) || 0;
          return standardA - standardB;
        });

        setStudents(sortedStudents)
        setPagination({
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total,
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }, [statusFilter, setStudents, setLoading])

  // Memoize handleSearch to prevent unnecessary recreations
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await apiClient.getStudents({
        search: query,
        status: statusFilter,
        page: 1,
        limit: 300,
      })

      if (response.success && response.data) {
        setSearchResults(response.data.students)
        setPagination({
          page: 1,
          totalPages: response.data.totalPages,
          total: response.data.total,
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to search students")
    } finally {
      setIsSearching(false)
    }
  }, [statusFilter])

  // Initial load - only run once on mount
  useEffect(() => {
    fetchStudents(1)
  }, []) // Empty dependency array - only run on mount

  // Handle status filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))

    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    } else {
      fetchStudents(1)
    }
  }, [statusFilter])

  // Handle pagination changes (only for non-search results)
  useEffect(() => {
    if (!searchQuery.trim() && pagination.page > 1) {
      fetchStudents(pagination.page)
    }
  }, [pagination.page])

  // Handle search query changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery)
      } else {
        setSearchResults([])
        setIsSearching(false)
        fetchStudents(1)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, handleSearch, fetchStudents])

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    // setPagination is handled in the useEffect above
  }

  const handleStudentClick = (student: IStudent) => {
    router.push(`/student-profiles/${student._id}`)
  }

  const handleDeleteClick = (student: IStudent, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialog({ open: true, student })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.student) return

    try {
      const response = await apiClient.deleteStudent(deleteDialog.student._id)

      if (response.success) {
        removeStudent(deleteDialog.student._id)
        setSuccessDialog({
          open: true,
          title: "Student Deleted",
          description: "The student has been successfully removed from the system.",
        })
        toast.success("Student deleted successfully")
      } else {
        toast.error(response.error || "Failed to delete student")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete student")
    } finally {
      setDeleteDialog({ open: false, student: null })
    }
  }

  const displayStudents = searchQuery.trim() ? searchResults : students
  const showLoading = isLoading || isSearching

  return (
    <MainLayout
      title="Student Profiles"
      subtitle={`Manage student information (${pagination.total} students)`}
      actions={
        <Button onClick={() => router.push("/register-students")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      }
    >
      <div className="container mx-auto p-2 space-y-2">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, student ID, or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Tested">Tested</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="NOC">NOC</SelectItem>
                <SelectItem value="NOC-Cancel">NOC-Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <div className="text-sm text-muted-foreground">
            {isSearching ? "Searching..." : `Found ${searchResults.length} results for "${searchQuery}"`}
          </div>
        )}

        {/* Students Grid */}
        {showLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <StudentProfileTileSkeleton key={i} />
            ))}
          </div>
        ) : displayStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayStudents.map((student) => (
              <div key={student._id} className="relative group">
                <StudentProfileTile student={student} onClick={() => handleStudentClick(student)} showDepartment />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteClick(student, e)}
                  title="Delete Student"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery.trim() ? "No students found matching your search criteria." : "No students found."}
            </p>
            <Button onClick={() => router.push("/register-students")} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add First Student
            </Button>
          </div>
        )}

        {/* Pagination - Only show for non-search results */}
        {!searchQuery.trim() && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, student: null })}
        title="Delete Student"
        description={`Are you sure you want to delete ${deleteDialog.student?.name.firstName} ${deleteDialog.student?.name.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
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

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Search, Filter, Plus, Trash2 } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { StudentProfileTile, StudentProfileTileSkeleton } from "@/components/student/student-profile-tile"
// import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
// import { SuccessDialog } from "@/components/dialogs/success-dialog"
// import { useStudentStore } from "@/store/student-store"
// import { apiClient } from "@/lib/api-client"
// import { toast } from "sonner"
// import { useRouter } from "next/navigation"
// import MainLayout from "@/components/layout/main-layout"
// import type { IStudent } from "@/types/student"

// export default function StudentProfilesPage() {
//   const router = useRouter()
//   const {
//     students,
//     isLoading,
//     searchQuery,
//     statusFilter,
//     setStudents,
//     setLoading,
//     setSearchQuery,
//     setStatusFilter,
//     removeStudent,
//   } = useStudentStore()

//   const [deleteDialog, setDeleteDialog] = useState<{
//     open: boolean
//     student: IStudent | null
//   }>({ open: false, student: null })

//   const [successDialog, setSuccessDialog] = useState<{
//     open: boolean
//     title: string
//     description: string
//   }>({ open: false, title: "", description: "" })

//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     total: 0,
//   })

//   const [searchResults, setSearchResults] = useState<IStudent[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       handleSearch()
//     } else {
//       fetchStudents()
//     }
//   }, [statusFilter, pagination.page])

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       handleSearch()
//     } else {
//       setSearchResults([])
//       setIsSearching(false)
//       fetchStudents()
//     }
//   }, [searchQuery])

//   const fetchStudents = async () => {
//     setLoading(true)
//     try {
//       const response = await apiClient.getStudents({
//         status: statusFilter,
//         page: pagination.page,
//         limit: 300,
//       })

//       if (response.success && response.data) {
//         setStudents(response.data.students)
//         setPagination({
//           page: response.data.page,
//           totalPages: response.data.totalPages,
//           total: response.data.total,
//         })
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Failed to fetch students")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return

//     setIsSearching(true)
//     try {
//       const response = await apiClient.getStudents({
//         search: searchQuery,
//         status: statusFilter,
//         page: 1, // Always show search results on first page
//         limit: 300,
//       })

//       if (response.success && response.data) {
//         setSearchResults(response.data.students)
//         setPagination({
//           page: 1,
//           totalPages: response.data.totalPages,
//           total: response.data.total,
//         })
//       }
//     } catch (error ) {
//       toast.error( error instanceof Error ? error.message : "Failed to search students")
//     } finally {
//       setIsSearching(false)
//     }
//   }

//   const handleStatusFilter = (value: string) => {
//     setStatusFilter(value)
//     setPagination((prev) => ({ ...prev, page: 1 }))
//   }

//   const handleStudentClick = (student: IStudent) => {
//     router.push(`/student-profiles/${student._id}`)
//   }

//   const handleDeleteClick = (student: IStudent, e: React.MouseEvent) => {
//     e.stopPropagation()
//     setDeleteDialog({ open: true, student })
//   }

//   const handleDeleteConfirm = async () => {
//     if (!deleteDialog.student) return

//     try {
//       const response = await apiClient.deleteStudent(deleteDialog.student._id)

//       if (response.success) {
//         removeStudent(deleteDialog.student._id)
//         setSuccessDialog({
//           open: true,
//           title: "Student Deleted",
//           description: "The student has been successfully removed from the system.",
//         })
//         toast.success("Student deleted successfully")
//       } else {
//         toast.error(response.error || "Failed to delete student")
//       }
//     } catch (error ) {
//       toast.error( error instanceof Error ? error.message : "Failed to delete student")
//     } finally {
//       setDeleteDialog({ open: false, student: null })
//     }
//   }

//   const displayStudents = searchQuery.trim() ? searchResults : students
//   const showLoading = isLoading || isSearching

//   return (
//     <MainLayout
//       title="Student Profiles"
//       subtitle={`Manage student information (${pagination.total} students)`}
//       actions={
//         <Button onClick={() => router.push("/register-students")}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Student
//         </Button>
//       }
//     >
//       <div className="container mx-auto p-2 space-y-2">
//         {/* Search and Filter Controls */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search by name, student ID, or roll number..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <div className="flex gap-2">
//             <Select value={statusFilter} onValueChange={handleStatusFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="Tested">Tested</SelectItem>
//                 <SelectItem value="Active">Active</SelectItem>
//                 <SelectItem value="NOC">NOC</SelectItem>
//                 <SelectItem value="NOC-Cancel">NOC-Cancel</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Search Results Info */}
//         {searchQuery.trim() && (
//           <div className="text-sm text-muted-foreground">
//             {isSearching ? "Searching..." : `Found ${searchResults.length} results for "${searchQuery}"`}
//           </div>
//         )}

//         {/* Students Grid */}
//         {showLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <StudentProfileTileSkeleton key={i} />
//             ))}
//           </div>
//         ) : displayStudents.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {displayStudents.map((student) => (
//               <div key={student._id} className="relative group">
//                 <StudentProfileTile student={student} onClick={() => handleStudentClick(student)} showDepartment />
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
//                   onClick={(e) => handleDeleteClick(student, e)}
//                   title="Delete Student"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">
//               {searchQuery.trim() ? "No students found matching your search criteria." : "No students found."}
//             </p>
//             <Button onClick={() => router.push("/register-students")} className="mt-4">
//               <Plus className="h-4 w-4 mr-2" />
//               Add First Student
//             </Button>
//           </div>
//         )}

//         {/* Pagination - Only show for non-search results */}
//         {!searchQuery.trim() && pagination.totalPages > 1 && (
//           <div className="flex justify-center gap-2">
//             <Button
//               variant="outline"
//               disabled={pagination.page === 1}
//               onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
//             >
//               Previous
//             </Button>
//             <span className="flex items-center px-4">
//               Page {pagination.page} of {pagination.totalPages}
//             </span>
//             <Button
//               variant="outline"
//               disabled={pagination.page === pagination.totalPages}
//               onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={deleteDialog.open}
//         onOpenChange={(open) => setDeleteDialog({ open, student: null })}
//         title="Delete Student"
//         description={`Are you sure you want to delete ${deleteDialog.student?.name.firstName} ${deleteDialog.student?.name.lastName}? This action cannot be undone.`}
//         confirmText="Delete"
//         cancelText="Cancel"
//         variant="destructive"
//         onConfirm={handleDeleteConfirm}
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
