"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"
import { SuccessDialog } from "@/components/dialogs/success-dialog"
import { apiClient } from "@/lib/api-client"
import { useStudentStore } from "@/store/student-store"
import { toast } from "sonner"
import MainLayout from "@/components/layout/main-layout"
import type { IStudent } from "@/types/student"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Tested: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  NOC: "bg-red-100 text-red-800 border-red-200",
  "NOC-Cancel": "bg-gray-100 text-gray-800 border-gray-200",
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { removeStudent } = useStudentStore()
  const [student, setStudent] = useState<IStudent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    title: "",
    description: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchStudent(params.id as string)
    }
  }, [params.id])

  const fetchStudent = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.getStudent(id)
      if (response.success && response.data) {
        setStudent(response.data)
      } else {
        toast.error("Student not found")
        router.push("/student-profiles")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch student details")
      router.push("/student-profiles")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return

    try {
      const response = await apiClient.deleteStudent(student._id)
      if (response.success) {
        removeStudent(student._id)
        setSuccessDialog({
          open: true,
          title: "Student Deleted",
          description: "The student has been successfully removed from the system.",
        })
        toast.success("Student deleted successfully")
      } else {
        toast.error(response.error || "Failed to delete student")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete student")
    } finally {
      setDeleteDialog(false)
    }
  }

  const handleSuccessClose = () => {
    setSuccessDialog({ open: false, title: "", description: "" })
    router.push("/student-profiles")
  }

  if (isLoading) {
    return (
      <MainLayout title="Student Details" subtitle="Loading student information...">
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!student) {
    return (
      <MainLayout title="Student Not Found" subtitle="The requested student could not be found">
        <div className="container mx-auto py-6 text-center">
          <p className="text-muted-foreground">Student not found</p>
          <Button onClick={() => router.push("/student-profiles")} className="mt-4">
            Back to Students
          </Button>
        </div>
      </MainLayout>
    )
  }

  const fullName = `${student.name} ${student.name?.firstName} ${student.name?.middleName} ${student.name?.lastName}`
  const initials = `${student.name} aaa ${student.name?.firstName[0]}${student.name?.lastName[0]}`

  return (
    <MainLayout
      title={fullName}
      subtitle={`Student ID: ${student.studentId}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/student-profiles/${student._id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/student-profiles")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>

        {/* Student Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={fullName} />
                <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{fullName}</h2>
                  <Badge variant="outline" className={cn("text-sm", statusColors[student.status])}>
                    {student.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Student ID:</span> {student.studentId}
                  </div>
                  <div>
                    <span className="font-medium">Standard:</span> {student.standard}
                  </div>
                  <div>
                    <span className="font-medium">Roll No:</span> {student.schoolRollNo}
                  </div>
                  <div>
                    <span className="font-medium">Medium:</span> {student.medium}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="family">Family Info</TabsTrigger>
            <TabsTrigger value="health">Health Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-sm">{fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-sm">{format(new Date(student.dateOfBirth), "PPP")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                      <p className="text-sm">{student.studentId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ID Type</label>
                      <p className="text-sm">{student.isPermanentId ? "Permanent" : "Temporary"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <p className="text-sm">
                        <Badge variant="outline" className={cn("text-xs", statusColors[student.status])}>
                          {student.status}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Satsangi</label>
                      <p className="text-sm">{student.isSatsangi ? "Yes" : "No"}</p>
                    </div>
                    {student.isSatsangi && student.yearOfSatsang && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Years of Satsang</label>
                        <p className="text-sm">{student.yearOfSatsang}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Arrays */}
                <div className="space-y-4">
                  {student.hobbies && student.hobbies.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hobbies</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.hobbies.map((hobby, index) => (
                          <Badge key={index} variant="secondary">
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.skills && student.skills.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Skills</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.achievements && student.achievements.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Achievements</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.achievements.map((achievement, index) => (
                          <Badge key={index} variant="secondary">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Information Tab */}
          <TabsContent value="family" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Father Information */}
                <div>
                  <h4 className="font-semibold mb-3">Father Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-sm">
                        {`${student.fatherName} ${student.fatherName?.firstName} ${student.fatherName?.middleName} ${student.fatherName?.lastName}`}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                      <p className="text-sm">{student.fatherMobileNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="text-sm">{student.fatherOccupation}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Mother Information */}
                {student.motherName && (
                  <div>
                    <h4 className="font-semibold mb-3">Mother Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-sm">
                          {`${student.motherName.firstName} ${student.motherName.middleName} ${student.motherName.lastName}`}
                        </p>
                      </div>
                      {student.motherMobileNumber && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                          <p className="text-sm">{student.motherMobileNumber}</p>
                        </div>
                      )}
                      {student.motherOccupation && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                          <p className="text-sm">{student.motherOccupation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Address Information */}
                <div>
                  <h4 className="font-semibold mb-3">Address Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm">{student.address.address}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p className="text-sm">{student.address.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        <p className="text-sm">{student.address.state}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Pin Code</label>
                        <p className="text-sm">{student.address.pincode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        <p className="text-sm">{student.address.country}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Native Place</label>
                      <p className="text-sm">{student.nativePlace}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Information Tab */}
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p className="text-sm">{student.bloodGroup || "Not specified"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {student.illnesses && student.illnesses.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Illnesses</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.illnesses.map((illness, index) => (
                          <Badge key={index} variant="outline">
                            {illness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {student.allergies && student.allergies.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!student.illnesses || student.illnesses.length === 0) &&
                    (!student.allergies || student.allergies.length === 0) && (
                      <p className="text-sm text-muted-foreground">No health issues or allergies recorded.</p>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Academic Info */}
                <div>
                  <h4 className="font-semibold mb-3">Current Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admission Year</label>
                      <p className="text-sm">{student.admissionYear}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admission Date</label>
                      <p className="text-sm">{format(new Date(student.admissionDate), "PPP")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Standard</label>
                      <p className="text-sm">{student.standard}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">School Roll Number</label>
                      <p className="text-sm">{student.schoolRollNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Medium</label>
                      <p className="text-sm">{student.medium}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Previous Academic Info */}
                <div>
                  <h4 className="font-semibold mb-3">Previous Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last School</label>
                      <p className="text-sm">{student.lastSchool}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Exam Given</label>
                      <p className="text-sm">{student.lastExamGiven}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Exam Percentage</label>
                      <p className="text-sm">{student.lastExamPercentage}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Student"
        description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialog.open}
        onOpenChange={(open) => setSuccessDialog({ ...successDialog, open })}
        title={successDialog.title}
        description={successDialog.description}
        buttonText="Back to Students"
      />
    </MainLayout>
  )
}
