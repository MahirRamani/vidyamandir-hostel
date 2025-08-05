// "use client"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { familyInfoSchema } from "@/lib/validations/student"
// import type { z } from "zod"

// type FamilyInfoFormData = z.infer<typeof familyInfoSchema>

// interface FamilyInfoFormProps {
//   initialData?: Partial<FamilyInfoFormData>
//   onNext: (data: FamilyInfoFormData) => void
//   onPrevious?: () => void
//   isSubmitting?: boolean
//   isLastStep?: boolean
// }

// export function FamilyInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: FamilyInfoFormProps) {
//   const form = useForm<FamilyInfoFormData>({
//     resolver: zodResolver(familyInfoSchema),
//     defaultValues: {
//       fatherName: {
//         firstName: initialData?.fatherName?.firstName || "",
//         middleName: initialData?.fatherName?.middleName || "",
//         lastName: initialData?.fatherName?.lastName || "",
//       },
//       fatherMobileNumber: initialData?.fatherMobileNumber || "",
//       fatherOccupation: initialData?.fatherOccupation || "",
//       motherName: {
//         firstName: initialData?.motherName?.firstName || "",
//         middleName: initialData?.motherName?.middleName || "",
//         lastName: initialData?.motherName?.lastName || "",
//       },
//       motherMobileNumber: initialData?.motherMobileNumber || "",
//       motherOccupation: initialData?.motherOccupation || "",
//       address: {
//         address: initialData?.address?.address || "",
//         city: initialData?.address?.city || "",
//         state: initialData?.address?.state || "",
//         pinCode: initialData?.address?.pinCode || "",
//         country: initialData?.address?.country || "",
//       },
//       nativePlace: initialData?.nativePlace || "",
//     },
//   })

//   const onSubmit = (data: FamilyInfoFormData) => {
//     onNext(data)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Father Information */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Father Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <FormField
//               control={form.control}
//               name="fatherName.firstName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Father's First Name *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter first name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="fatherName.middleName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Father's Middle Name *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter middle name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="fatherName.lastName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Father's Last Name *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter last name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="fatherMobileNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Father's Mobile Number *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter 10-digit mobile number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="fatherOccupation"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Father's Occupation *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter occupation" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Mother Information */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Mother Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <FormField
//               control={form.control}
//               name="motherName.firstName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mother's First Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter first name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="motherName.middleName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mother's Middle Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter middle name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="motherName.lastName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mother's Last Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter last name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="motherMobileNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mother's Mobile Number</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter 10-digit mobile number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="motherOccupation"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mother's Occupation</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter occupation" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Address Information */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Address Information</h3>
//           <FormField
//             control={form.control}
//             name="address.address"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Address *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter full address" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="address.city"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>City *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter city" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="address.state"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>State *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter state" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="address.pinCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Pin Code *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter 6-digit pin code" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="address.country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Country *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter country" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <FormField
//             control={form.control}
//             name="nativePlace"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Native Place *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter native place" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between">
//           {onPrevious && (
//             <Button type="button" variant="outline" onClick={onPrevious}>
//               Previous
//             </Button>
//           )}
//           <Button type="submit" disabled={isSubmitting} className="ml-auto">
//             {isLastStep ? "Submit" : "Next"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
