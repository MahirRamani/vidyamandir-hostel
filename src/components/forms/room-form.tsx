// "use client"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { roomSchema, type RoomFormData } from "@/lib/validations/room"
// import type { IRoom } from "@/types/room"
// import type { IBuilding } from "@/types/building"

// interface RoomFormProps {
//   initialData?: IRoom
//   buildings: IBuilding[]
//   onSubmit: (data: RoomFormData) => void
//   onCancel: () => void
//   isSubmitting?: boolean
// }

// export function RoomForm({ initialData, buildings, onSubmit, onCancel, isSubmitting }: RoomFormProps) {
//   const form = useForm<RoomFormData>({
//     resolver: zodResolver(roomSchema),
//     defaultValues: {
//       number: initialData?.number || "",
//       capacity: initialData?.capacity || 1,
//       buildingId: initialData?.buildingId || "",
//     },
//   })

//   const handleSubmit = (data: RoomFormData) => {
//     onSubmit(data)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="number"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Room Number *</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter room number" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="capacity"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Capacity *</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   min="1"
//                   max="20"
//                   placeholder="Enter room capacity"
//                   {...field}
//                   onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="buildingId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Building *</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select building" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {buildings.map((building) => (
//                     <SelectItem key={building._id} value={building._id}>
//                       {building.name}
//                     </SelectItem>
//                   ))}
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
//             {isSubmitting ? "Saving..." : "Save Room"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }
