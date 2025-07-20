"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { basicInfoSchema } from "@/lib/validations/student"
import type { z } from "zod"
import { useState } from "react"
import { CalendarIcon, Plus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type BasicInfoFormData = z.infer<typeof basicInfoSchema>

interface BasicInfoFormProps {
  initialData?: Partial<BasicInfoFormData>
  onNext: (data: BasicInfoFormData) => void
  onPrevious?: () => void
  isSubmitting?: boolean
  isLastStep?: boolean
}

export function BasicInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: BasicInfoFormProps) {
  const [hobbies, setHobbies] = useState<string[]>(initialData?.hobbies || [])
  const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
  const [achievements, setAchievements] = useState<string[]>(initialData?.achievements || [])

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: {
        firstName: initialData?.name?.firstName || "",
        middleName: initialData?.name?.middleName || "",
        lastName: initialData?.name?.lastName || "",
      },
      profileImageUrl: initialData?.profileImageUrl || "",
      dateOfBirth: initialData?.dateOfBirth || undefined,
      studentId: initialData?.studentId || "",
      isPermanentId: initialData?.isPermanentId || false,
      hobbies: initialData?.hobbies || [],
      skills: initialData?.skills || [],
      achievements: initialData?.achievements || [],
      status: initialData?.status || "Pending",
      isSatsangi: initialData?.isSatsangi || false,
      yearsOfSatsang: initialData?.yearsOfSatsang || undefined,
    },
  })

  const addArrayItem = (type: "hobbies" | "skills" | "achievements", value: string) => {
    if (!value.trim()) return

    const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
    const setArray = type === "hobbies" ? setHobbies : type === "skills" ? setSkills : setAchievements

    if (!currentArray.includes(value.trim())) {
      const newArray = [...currentArray, value.trim()]
      setArray(newArray)
      form.setValue(type, newArray)
    }
  }

  const removeArrayItem = (type: "hobbies" | "skills" | "achievements", index: number) => {
    const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
    const setArray = type === "hobbies" ? setHobbies : type === "skills" ? setSkills : setAchievements

    const newArray = currentArray.filter((_, i) => i !== index)
    setArray(newArray)
    form.setValue(type, newArray)
  }

  const onSubmit = (data: BasicInfoFormData) => {
    onNext({ ...data, hobbies, skills, achievements })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name.middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter middle name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Profile Image and Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="profileImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter profile image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Student ID and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Tested">Tested</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="NOC">NOC</SelectItem>
                    <SelectItem value="NOC-Cancel">NOC-Cancel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPermanentId"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Permanent ID</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Satsangi Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isSatsangi"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Satsangi</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {form.watch("isSatsangi") && (
            <FormField
              control={form.control}
              name="yearsOfSatsang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Satsang</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter years"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Dynamic Arrays */}
        {["hobbies", "skills", "achievements"].map((type) => {
          const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
          return (
            <div key={type} className="space-y-2">
              <Label className="capitalize">{type}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={`Add ${type.slice(0, -1)}`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addArrayItem(type as any, e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addArrayItem(type as any, input.value)
                    input.value = ""
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentArray.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                    {item}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeArrayItem(type as any, index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {onPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isLastStep ? "Submit" : "Next"}
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
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { basicInfoSchema } from "@/lib/validations/student"
// import type { z } from "zod"
// import { useState } from "react"
// import { CalendarIcon, Plus, X } from "lucide-react"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"

// type BasicInfoFormData = z.infer<typeof basicInfoSchema>

// interface BasicInfoFormProps {
//   initialData?: Partial<BasicInfoFormData>
//   onNext: (data: BasicInfoFormData) => void
//   onPrevious?: () => void
//   isSubmitting?: boolean
//   isLastStep?: boolean
// }

// export function BasicInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: BasicInfoFormProps) {
//   const [hobbies, setHobbies] = useState<string[]>(initialData?.hobbies || [])
//   const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
//   const [achievements, setAchievements] = useState<string[]>(initialData?.achievements || [])

//   const form = useForm<BasicInfoFormData>({
//     resolver: zodResolver(basicInfoSchema),
//     defaultValues: {
//       name: {
//         firstName: initialData?.name?.firstName || "",
//         middleName: initialData?.name?.middleName || "",
//         lastName: initialData?.name?.lastName || "",
//       },
//       profileImageUrl: initialData?.profileImageUrl || "",
//       dateOfBirth: initialData?.dateOfBirth || undefined,
//       studentId: initialData?.studentId || "",
//       isPermanentId: initialData?.isPermanentId || false,
//       hobbies: initialData?.hobbies || [],
//       skills: initialData?.skills || [],
//       achievements: initialData?.achievements || [],
//       status: initialData?.status || "Pending",
//       isSatsangi: initialData?.isSatsangi || false,
//       yearsOfSatsang: initialData?.yearsOfSatsang || undefined,
//     },
//   })

//   const addArrayItem = (type: "hobbies" | "skills" | "achievements", value: string) => {
//     if (!value.trim()) return

//     const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
//     const setArray = type === "hobbies" ? setHobbies : type === "skills" ? setSkills : setAchievements

//     if (!currentArray.includes(value.trim())) {
//       const newArray = [...currentArray, value.trim()]
//       setArray(newArray)
//       form.setValue(type, newArray)
//     }
//   }

//   const removeArrayItem = (type: "hobbies" | "skills" | "achievements", index: number) => {
//     const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
//     const setArray = type === "hobbies" ? setHobbies : type === "skills" ? setSkills : setAchievements

//     const newArray = currentArray.filter((_, i) => i !== index)
//     setArray(newArray)
//     form.setValue(type, newArray)
//   }

//   const onSubmit = (data: BasicInfoFormData) => {
//     onNext({ ...data, hobbies, skills, achievements })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Name Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormField
//             control={form.control}
//             name="name.firstName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>First Name *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter first name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="name.middleName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Middle Name *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter middle name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="name.lastName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Last Name *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter last name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Profile Image and Basic Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="profileImageUrl"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Profile Image URL *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter profile image URL" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="dateOfBirth"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Date of Birth *</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant="outline"
//                         className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                       >
//                         {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={field.value}
//                       onSelect={field.onChange}
//                       disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Student ID and Status */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <FormField
//             control={form.control}
//             name="studentId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Student ID *</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter student ID" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status *</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Tested">Tested</SelectItem>
//                     <SelectItem value="Active">Active</SelectItem>
//                     <SelectItem value="NOC">NOC</SelectItem>
//                     <SelectItem value="NOC-Cancel">NOC-Cancel</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="isPermanentId"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                 <FormControl>
//                   <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Permanent ID</FormLabel>
//                 </div>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Satsangi Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="isSatsangi"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                 <FormControl>
//                   <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Is Satsangi</FormLabel>
//                 </div>
//               </FormItem>
//             )}
//           />
//           {form.watch("isSatsangi") && (
//             <FormField
//               control={form.control}
//               name="yearsOfSatsang"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Years of Satsang</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Enter years"
//                       {...field}
//                       onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )}
//         </div>

//         {/* Dynamic Arrays */}
//         {["hobbies", "skills", "achievements"].map((type) => {
//           const currentArray = type === "hobbies" ? hobbies : type === "skills" ? skills : achievements
//           return (
//             <div key={type} className="space-y-2">
//               <Label className="capitalize">{type}</Label>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder={`Add ${type.slice(0, -1)}`}
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault()
//                       addArrayItem(type as any, e.currentTarget.value)
//                       e.currentTarget.value = ""
//                     }
//                   }}
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   onClick={(e) => {
//                     const input = e.currentTarget.previousElementSibling as HTMLInputElement
//                     addArrayItem(type as any, input.value)
//                     input.value = ""
//                   }}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {currentArray.map((item, index) => (
//                   <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
//                     {item}
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="h-4 w-4 p-0"
//                       onClick={() => removeArrayItem(type as any, index)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )
//         })}

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
