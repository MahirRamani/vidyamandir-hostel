"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { MultiStepForm } from "@/components/forms/multi-step-form"
// import { BasicInfoForm } from "@/components/forms/basic-info-form"
// import { FamilyInfoForm } from "@/components/forms/family-info-form"
// import { HealthInfoForm } from "@/components/forms/health-info-form"
import { AcademicInfoForm } from "@/components/forms/academic-info-form"
import { SuccessDialog } from "@/components/dialogs/success-dialog"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import MainLayout from "@/components/layout/main-layout"
import type { IStudent } from "@/types/student"
import { Skeleton } from "@/components/ui/skeleton"

const steps = [
  {
    id: "basicInfo",
    title: "Basic Information",
    description: "Update student's basic details",
    // component: BasicInfoForm,
  },
  {
    id: "familyInfo",
    title: "Family Information",
    description: "Update family and contact details",
    // component: FamilyInfoForm,
  },
  {
    id: "healthInfo",
    title: "Health Information",
    description: "Update health and medical details",
    // component: HealthInfoForm,
  },
  {
    id: "academicInfo",
    title: "Academic Information",
    description: "Update academic and admission details",
    component: AcademicInfoForm,
  },
]

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<IStudent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

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
    } catch (error) {
      toast.error( error instanceof Error ? error.message : "Failed to fetch student details")
      router.push("/student-profiles")
    } finally {
      setIsLoading(false)
    }
  }

  // const handleFormComplete = async (formData: any) => {
  //   if (!student) return

  //   try {
  //     const response = await apiClient.updateStudent(student._id, formData)

  //     if (response.success) {
  //       setShowSuccess(true)
  //       toast.success("Student updated successfully!")
  //     } else {
  //       toast.error(response.error || "Failed to update student")
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error)
  //     toast.error( error instanceof Error ? error.message : "Failed to update student")
  //   }
  // }

  // const handleSuccessClose = () => {
  //   setShowSuccess(false)
  //   router.push(`/student-profiles/${student?._id}`)
  // }

  if (isLoading) {
    return (
      <MainLayout title="Edit Student" subtitle="Loading student information...">
        <div className="container mx-auto py-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-96 w-full" />
            </div>
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

  const fullName = `${student.name.firstName} ${student.name.middleName} ${student.name.lastName}`

  // Prepare initial data for the form
  const initialFormData = {
    basicInfo: {
      name: student.name,
      dateOfBirth: new Date(student.dateOfBirth),
      studentId: student.studentId,
      isPermanentId: student.isPermanentId,
      hobbies: student.hobbies || [],
      skills: student.skills || [],
      achievements: student.achievements || [],
      status: student.status,
      isSatsangi: student.isSatsangi,
      yearsOfSatsang: student.yearsOfSatsang,
    },
    familyInfo: {
      fatherName: student.fatherName,
      fatherMobileNumber: student.fatherMobileNumber,
      fatherOccupation: student.fatherOccupation,
      motherName: student.motherName,
      motherMobileNumber: student.motherMobileNumber,
      motherOccupation: student.motherOccupation,
      address: student.address,
      nativePlace: student.nativePlace,
    },
    healthInfo: {
      bloodGroup: student.bloodGroup,
      illnesses: student.illnesses || [],
      allergies: student.allergies || [],
    },
    academicInfo: {
      admissionYear: student.admissionYear,
      schoolRollNo: student.schoolRollNo,
      standard: student.standard,
      medium: student.medium,
      lastSchool: student.lastSchool,
      lastExamGiven: student.lastExamGiven,
      lastExamPercentage: student.lastExamPercentage,
      admissionDate: new Date(student.admissionDate),
    },
  }

  return (
    <MainLayout title={`Edit ${fullName}`} subtitle={`Student ID: ${student.studentId}`}>
      <div className="container mx-auto py-8 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push(`/student-profiles/${student._id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Student Details
        </Button>

        {/* <MultiStepForm
          steps={steps.map((step) => ({
            ...step,
            component: (props: any) => (
              <step.component {...props} initialData={initialFormData[step.id as keyof typeof initialFormData]} />
            ),
          }))}
          onComplete={handleFormComplete}
          className="max-w-4xl mx-auto"
        /> */}

        <SuccessDialog
          open={showSuccess}
          onOpenChange={setShowSuccess}
          title="Update Successful!"
          description="The student information has been successfully updated."
          buttonText="View Student"
        />
      </div>
    </MainLayout>
  )
}
