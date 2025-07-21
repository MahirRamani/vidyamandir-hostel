"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { departmentSchema, type DepartmentFormData } from "@/lib/validations/department"
import type { IStudent } from "@/types/student"
import type { IDepartment } from "@/types/department"

interface DepartmentFormProps {
  initialData?: IDepartment
  students: IStudent[]
  onSubmit: (data: DepartmentFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function DepartmentForm({ initialData, students, onSubmit, onCancel, isSubmitting }: DepartmentFormProps) {
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      HOD: typeof initialData?.HOD === "string" ? initialData.HOD : initialData?.HOD?.toString() || "none",
      subHOD: typeof initialData?.subHOD === "string" ? initialData.subHOD : initialData?.subHOD?.toString() || "none",
      description: initialData?.description || "",
    },
  })

  const handleSubmit = (data: DepartmentFormData) => {
    // Convert empty strings to undefined for optional fields
    const processedData = {
      ...data,
      HOD: data.HOD === "" || data.HOD === "none" ? undefined : data.HOD,
      subHOD: data.subHOD === "" || data.subHOD === "none" ? undefined : data.subHOD,
    }
    onSubmit(processedData)
  }

  const selectedHOD = form.watch("HOD")

  // Filter students to only show those assigned to THIS department (for editing)
  // For new departments, no students will be available until they're assigned
  const departmentStudents = initialData ? students.filter((student) => student.departmentId?.toString() === initialData._id) : []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter department name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter department description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData && (
          <>
            <FormField
              control={form.control}
              name="HOD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head of Department (HOD)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HOD" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No HOD Selected</SelectItem>
                      {departmentStudents.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {`${student.name.firstName} ${student.name.lastName} (${student.studentId})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {departmentStudents.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Assign students to this department first to select HOD
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subHOD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Head of Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sub HOD" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Sub HOD Selected</SelectItem>
                      {departmentStudents
                        .filter((student) => student._id !== selectedHOD)
                        .map((student) => (
                          <SelectItem key={student._id} value={student._id}>
                            {`${student.name.firstName} ${student.name.lastName} (${student.studentId})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {departmentStudents.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Assign students to this department first to select Sub HOD
                    </p>
                  )}
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Department"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// "use client"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { departmentSchema, type DepartmentFormData } from "@/lib/validations/department"
// import type { IStudent } from "@/types/student"

// interface DepartmentFormProps {
//   initialData?: Partial<DepartmentFormData>
//   students: IStudent[]
//   onSubmit: (data: DepartmentFormData) => void
//   onCancel: () => void
//   isSubmitting?: boolean
// }

// export function DepartmentForm({ initialData, students, onSubmit, onCancel, isSubmitting }: DepartmentFormProps) {
//   const form = useForm<DepartmentFormData>({
//     resolver: zodResolver(departmentSchema),
//     defaultValues: {
//       name: initialData?.name || "",
//       HOD: initialData?.HOD || "none",
//       subHOD: initialData?.subHOD || "none",
//       description: initialData?.description || "",
//     },
//   })

//   const handleSubmit = (data: DepartmentFormData) => {
//     // Convert empty strings to undefined for optional fields
//     const processedData = {
//       ...data,
//       HOD: data.HOD === "" || data.HOD === "none" ? undefined : data.HOD,
//       subHOD: data.subHOD === "" || data.subHOD === "none" ? undefined : data.subHOD,
//     }
//     onSubmit(processedData)
//   }

//   const selectedHOD = form.watch("HOD")

//   // Filter students to only show those who are assigned to departments (for HOD/Sub HOD selection)
//   const eligibleStudents = students.filter((student) => student.departmentId)

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Department Name *</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter department name" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description *</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Enter department description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="HOD"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Head of Department (HOD)</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value || "none"}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select HOD" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="none">No HOD Selected</SelectItem>
//                   {eligibleStudents.map((student) => (
//                     <SelectItem key={student._id} value={student._id}>
//                       {`${student.name.firstName} ${student.name.lastName} (${student.studentId})`}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="subHOD"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Sub Head of Department</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value || "none"}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Sub HOD" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="none">No Sub HOD Selected</SelectItem>
//                   {eligibleStudents
//                     .filter((student) => student._id !== selectedHOD)
//                     .map((student) => (
//                       <SelectItem key={student._id} value={student._id}>
//                         {`${student.name.firstName} ${student.name.lastName} (${student.studentId})`}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex justify-end gap-2">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Save Department"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
