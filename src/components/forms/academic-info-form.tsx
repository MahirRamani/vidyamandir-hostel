"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { academicInfoSchema } from "@/lib/validations/student"
import type { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type AcademicInfoFormData = z.infer<typeof academicInfoSchema>

interface AcademicInfoFormProps {
  initialData?: Partial<AcademicInfoFormData>
  onNext: (data: AcademicInfoFormData) => void
  onPrevious?: () => void
  isSubmitting?: boolean
  isLastStep?: boolean
}

export function AcademicInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: AcademicInfoFormProps) {
  const form = useForm<AcademicInfoFormData>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      admissionYear: initialData?.admissionYear || "",
      schoolRollNo: initialData?.schoolRollNo || 0,
      standard: initialData?.standard || 0,
      medium: initialData?.medium || undefined,
      lastSchool: initialData?.lastSchool || "",
      lastExamGiven: initialData?.lastExamGiven || "",
      lastExamPercentage: initialData?.lastExamPercentage || 0,
      admissionDate: initialData?.admissionDate || undefined,
    },
  })

  const onSubmit = (data: AcademicInfoFormData) => {
    onNext(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="admissionYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Year *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admission year (e.g., 2024)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick admission date</span>}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number.parseInt(value))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select standard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((std) => (
                        <SelectItem key={std} value={std.toString()}>
                          {std}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolRollNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Roll Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter roll number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Previous Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Previous Academic Information</h3>
          <FormField
            control={form.control}
            name="lastSchool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last School *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastExamGiven"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Exam Given *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last exam name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastExamPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Exam Percentage *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter percentage (0-100)"
                      min="0"
                      max="100"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
