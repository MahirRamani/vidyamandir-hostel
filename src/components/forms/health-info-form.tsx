"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { healthInfoSchema } from "@/lib/validations/student"
import type { z } from "zod"

type HealthInfoFormData = z.infer<typeof healthInfoSchema>

interface HealthInfoFormProps {
  initialData?: Partial<HealthInfoFormData>
  onNext: (data: HealthInfoFormData) => void
  onPrevious?: () => void
  isSubmitting?: boolean
  isLastStep?: boolean
}

export function HealthInfoForm({ initialData, onNext, onPrevious, isSubmitting, isLastStep }: HealthInfoFormProps) {
  const form = useForm<HealthInfoFormData>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      bloodGroup: initialData?.bloodGroup || undefined,
      illnesses: initialData?.illnesses || [],
      allergies: initialData?.allergies || [],
    },
  })

  const onSubmit = (data: HealthInfoFormData) => {
    // Convert individual illness/allergy inputs to arrays
    const processedData = {
      ...data,
      illnesses: [data.illnesses?.[0] || "", data.illnesses?.[1] || "", data.illnesses?.[2] || ""].filter(Boolean),
      allergies: [data.allergies?.[0] || "", data.allergies?.[1] || "", data.allergies?.[2] || ""].filter(Boolean),
    }
    onNext(processedData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Blood Group */}
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Individual Inputs for Illnesses */}
        <div className="space-y-4">
          <h4 className="font-medium">Illnesses</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <FormField
                key={`illness-${index}`}
                control={form.control}
                name={`illnesses.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Illness {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter illness ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Individual Inputs for Allergies */}
        <div className="space-y-4">
          <h4 className="font-medium">Allergies</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <FormField
                key={`allergy-${index}`}
                control={form.control}
                name={`allergies.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergy {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter allergy ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
