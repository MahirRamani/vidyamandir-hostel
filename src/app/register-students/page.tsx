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

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { MultiStepForm } from "@/components/forms/multi-step-form"
// import { BasicInfoForm } from "@/components/forms/basic-info-form"
// import { SuccessDialog } from "@/components/dialogs/success-dialog"
// import { apiClient } from "@/lib/api-client"
// import MainLayout from "@/components/layout/main-layout"

// // Import other form components (to be created)
// const FamilyInfoForm = ({ initialData, onNext, onPrevious, isSubmitting }: any) => (
//   <div className="p-8 text-center">
//     <h3 className="text-lg font-semibold mb-4">Family Information Form</h3>
//     <p className="text-muted-foreground mb-6">This form component needs to be implemented</p>
//     <div className="flex justify-between">
//       {onPrevious && (
//         <button onClick={onPrevious} className="px-4 py-2 border rounded">
//           Previous
//         </button>
//       )}
//       <button
//         onClick={() => onNext({})}
//         className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
//         disabled={isSubmitting}
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )

// const HealthInfoForm = ({ initialData, onNext, onPrevious, isSubmitting }: any) => (
//   <div className="p-8 text-center">
//     <h3 className="text-lg font-semibold mb-4">Health Information Form</h3>
//     <p className="text-muted-foreground mb-6">This form component needs to be implemented</p>
//     <div className="flex justify-between">
//       {onPrevious && (
//         <button onClick={onPrevious} className="px-4 py-2 border rounded">
//           Previous
//         </button>
//       )}
//       <button
//         onClick={() => onNext({})}
//         className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
//         disabled={isSubmitting}
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )

// const AcademicInfoForm = ({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: any) => (
//   <div className="p-8 text-center">
//     <h3 className="text-lg font-semibold mb-4">Academic Information Form</h3>
//     <p className="text-muted-foreground mb-6">This form component needs to be implemented</p>
//     <div className="flex justify-between">
//       {onPrevious && (
//         <button onClick={onPrevious} className="px-4 py-2 border rounded">
//           Previous
//         </button>
//       )}
//       <button
//         onClick={() => onNext({})}
//         className="px-4 py-2 bg-green-500 text-white rounded ml-auto"
//         disabled={isSubmitting}
//       >
//         {isLastStep ? "Submit" : "Next"}
//       </button>
//     </div>
//   </div>
// )

// const steps = [
//   {
//     id: "basicInfo",
//     title: "Basic Information",
//     description: "Enter student's basic details",
//     component: BasicInfoForm,
//   },
//   {
//     id: "familyInfo",
//     title: "Family Information",
//     description: "Enter family and contact details",
//     component: FamilyInfoForm,
//   },
//   {
//     id: "healthInfo",
//     title: "Health Information",
//     description: "Enter health and medical details",
//     component: HealthInfoForm,
//   },
//   {
//     id: "academicInfo",
//     title: "Academic Information",
//     description: "Enter academic and admission details",
//     component: AcademicInfoForm,
//   },
// ]

// export default function RegisterStudentPage() {
//   const router = useRouter()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const handleFormComplete = async (formData: any) => {
//     try {
//       const response = await apiClient.createStudent(formData)

//       if (response.success) {
//         setShowSuccess(true)
//         toast.success("Student registered successfully!")
//       } else {
//         toast.error(response.error || "Failed to register student")
//       }
//     } catch (error: any) {
//       console.error("Registration error:", error)
//       toast.error(error.message || "Failed to register student")
//     }
//   }

//   const handleSuccessClose = () => {
//     setShowSuccess(false)
//     router.push("/student-profiles")
//   }

//   return (
//     <MainLayout title="Student Registration" subtitle="Register a new student in the hostel management system">
//       <div className="container mx-auto py-8">
//         <MultiStepForm steps={steps} onComplete={handleFormComplete} className="max-w-4xl mx-auto" />

//         <SuccessDialog
//           open={showSuccess}
//           onOpenChange={setShowSuccess}
//           title="Registration Successful!"
//           description="The student has been successfully registered in the system."
//           buttonText="View Students"
//         />
//       </div>
//     </MainLayout>
//   )
// }
