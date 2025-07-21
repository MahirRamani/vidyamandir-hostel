"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { BasicInfoForm } from "@/components/forms/basic-info-form"
import { SuccessDialog } from "@/components/dialogs/success-dialog"
import { apiClient } from "@/lib/api-client"

// Import the new form components
import { FamilyInfoForm } from "@/components/forms/family-info-form"
import { HealthInfoForm } from "@/components/forms/health-info-form"
import { AcademicInfoForm } from "@/components/forms/academic-info-form"
import MainLayout from "@/components/layout/main-layout"

const steps = [
  {
    id: "basicInfo",
    title: "Basic Information",
    description: "Enter student's basic details",
    component: BasicInfoForm,
  },
  {
    id: "familyInfo",
    title: "Family Information",
    description: "Enter family and contact details",
    component: FamilyInfoForm,
  },
  {
    id: "healthInfo",
    title: "Health Information",
    description: "Enter health and medical details",
    component: HealthInfoForm,
  },
  {
    id: "academicInfo",
    title: "Academic Information",
    description: "Enter academic and admission details",
    component: AcademicInfoForm,
  },
]

export default function RegisterStudentPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFormComplete = async (formData: any) => {
    try {
      const response = await apiClient.createStudent(formData)

      if (response.success) {
        setShowSuccess(true)
        toast.success("Student registered successfully!")
      } else {
        toast.error(response.error || "Failed to register student")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to register student")
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push("/student-profiles")
  }

  return (
    <MainLayout title="Student Registration" subtitle="Register a new student in the hostel management system">
      <div className="container mx-auto py-8">
        <MultiStepForm steps={steps} onComplete={handleFormComplete} className="max-w-4xl mx-auto" />

        <SuccessDialog
          open={showSuccess}
          onOpenChange={setShowSuccess}
          title="Registration Successful!"
          description="The student has been successfully registered in the system."
          buttonText="View Students"
        />
      </div>
    </MainLayout>
  )
}
